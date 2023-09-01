import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from 'src/user/entities/user.entity';
import { Repository } from 'typeorm';
import { Token } from './entities/Token.entity';
import * as speakeasy from 'speakeasy';
import * as qrcode from 'qrcode';
import * as crypto from 'crypto';
import * as bcrypt from 'bcrypt';
import { Statastics } from 'src/game/statistics/entities/statistics.entity';

@Injectable()
export class AuthenticatorService {
  constructor(
    @InjectRepository(User) private readonly UserRepo: Repository<User>,
    @InjectRepository(Token) private readonly TokenRepo: Repository<Token>,
    @InjectRepository(Statastics) private readonly StatisticsRepo: Repository<Statastics>
  ) { }

  async removeToken(userId: number) {
    const user = await this.UserRepo.findOne({ where: { id: userId } });
    const token = await this.TokenRepo.findOne({
      where: [{ User: user }],
      relations: { User: true },
    });
    return await this.TokenRepo.delete(token);
  }
  async TwoFA_Disable(id: number) {
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user || !user.TwoFAenabled) return null;
    return await this.UserRepo.save({
      id: id,
      TwoFAenabled: false,
      TwoFAsecret: ''
    });
  }

  async TwoFactoRequired(id: number) {
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user || !user.TwoFAenabled) return false;
    return true;
  }

  async TwoFA_SendQr(id: number) {
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user || user.TwoFAenabled) return null;
    var result: any;
    try {
      const secret = await speakeasy.generateSecret();
      result = await qrcode.toDataURL(secret.otpauth_url);
      if (result)
        await this.UserRepo.save({
          id: id,
          TwoFAenabled: false,
          TwoFAsecret: secret.base32,
        });
    } catch (err) {
      return null;
    }
    return result;
  }

  async checkbackups(list: string, entered: string) {
    if (list.length == 0) return null;
    const listing: string[] = list.split(';');
    for (let i: number = 0; i < listing.length; i++) {
      if (await bcrypt.compare(entered, listing[i])) {
        let end = '';
        for (let j = 0; j < listing.length - 1; j++) {
          if (i != j) end += listing[j] + ';';
        }
        return end;
      }
    }
    return null;
  }

  async TwoFA_Validate(id: number, token: string) {
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user || !user.TwoFAenabled) return null;
    const tok = await this.TokenRepo.findOne({ where: { User: user } });
    if (!tok) return null;
    const verify = await speakeasy.totp.verify({
      secret: user.TwoFAsecret,
      encoding: 'base32',
      token: token,
    });
    if (!verify) {
      const ret = await this.checkbackups(user.backups, token);
      if (ret != null) {
        const tok = await this.TokenRepo.findOne({ where: { User: user } });
        await this.TokenRepo.save({ token: tok.token, loggedIn: true });
        return await this.UserRepo.save({ id: id, backups: ret });
      }
      return null;
    }
    await this.TokenRepo.save({ token: tok.token, loggedIn: true });
    return user;
  }

  async hashing(backups: number[], salt: string) {
    let ret: string = '';
    for (let i: number = 0; i < backups.length; i++)
      ret += (await bcrypt.hash(backups[i].toString(), salt)) + ';';
    return ret;
  }

  async TwoFA_Enabling(id: number, token: string) {
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user || user.TwoFAenabled || user.TwoFAsecret == '') return null;
    const verify = await speakeasy.totp.verify({
      secret: user.TwoFAsecret,
      encoding: 'base32',
      token: token,
    });
    if (!verify) return null;
    const secret: string = user.TwoFAsecret;
    let backups = [];
    for (let i: number = 0; i < 6; i++)
      backups.push(crypto.randomInt(100000, 999999));
    const salt = await bcrypt.genSalt();
    const tostore = await this.hashing(backups, salt);
    return {
      user: await this.UserRepo.save({
        id: id,
        TwoFAenabled: true,
        TwoFAsecret: user.TwoFAsecret,
        backups: tostore,
      }),
      backups: backups,
    };
  }

  async validating(
    id: number,
    username: string,
    name: string,
    avatar: string,
  ): Promise<User> | undefined {
    let user = await this.UserRepo.findOne({ where: { id: id } });
    if (user) return user;
    user = await this.UserRepo.save({
      id: id,
      username: username,
      name: name,
      avatar: avatar,
      TwoFAenabled: false,
      TwoFAsecret: '',
      theme: 1
    });
    await this.StatisticsRepo.save({ User: user, score: 0, total: 0, win: 0 });
    return user;
  }
  async GenToken(id: number, new_token: string) {
    var time = new Date();
    const user = await this.UserRepo.findOne({ where: { id: id } });
    if (!user) return null;
    const token = await this.TokenRepo.find({
      where: [{ token: new_token }, { User: user }],
      relations: { User: true },
    });
    if (token.length > 1) return null;
    if (!token || token.length == 0) {
      time.setDate(time.getDate() + 7);
      if (user.TwoFAenabled)
        return await this.TokenRepo.save({
          token: new_token,
          expiration_date: time.toISOString(),
          loggedIn: false,
          User: user,
        });
      return await this.TokenRepo.save({
        token: new_token,
        expiration_date: time.toISOString(),
        loggedIn: true,
        User: user,
      });
    }
    if (
      new_token != token[0].token ||
      time.toISOString() >= token[0].expiration_date.toISOString()
    ) {
      time.setDate(time.getDate() + 7);
      await this.TokenRepo.delete(token[0]);
      if (user.TwoFAenabled)
        return await this.TokenRepo.save({
          token: new_token,
          expiration_date: time.toISOString(),
          loggedIn: false,
          User: user,
        });
      return await this.TokenRepo.save({
        token: new_token,
        expiration_date: time.toISOString(),
        loggedIn: true,
        User: user,
      });
    }
    return token[0];
  }
  async IsSame(id: number, token: string) {
    const TokenUSer = await this.TokenRepo.findOne({
      where: { token: token },
      relations: { User: true },
    });
    if (!TokenUSer) return false;
    if (TokenUSer.User.TwoFAenabled && TokenUSer.loggedIn == false)
      return false;
    const time = new Date();
    if (
      TokenUSer.token == token &&
      time.toISOString() < TokenUSer.expiration_date.toISOString() &&
      TokenUSer.User.id == id
    )
      return true;
    return false;
  }

  async IsSameBut(id: number, token: string) {
    const TokenUSer = await this.TokenRepo.findOne({
      where: { token: token },
      relations: { User: true },
    });
    if (!TokenUSer) return false;
    if (TokenUSer.User.TwoFAenabled == true && TokenUSer.loggedIn == false)
      return { TFA: TokenUSer.User };
    const time = new Date();
    if (
      TokenUSer.token == token &&
      time.toISOString() < TokenUSer.expiration_date.toISOString() &&
      TokenUSer.User.id == id
    )
      return true;
    return false;
  }
}
