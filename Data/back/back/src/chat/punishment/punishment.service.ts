import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { LessThanOrEqual, Repository } from 'typeorm';
import { Punishment } from './punishment.entity';
import {
  createPunishmenEntity,
  getTimeDiff,
  validatePunishmentDto,
} from './punishment.utils';
import { InjectRepository } from '@nestjs/typeorm';
// import { User } from 'src/user/user.entity';

import { createPunishmentDTO } from './dto/createPunishment.dto';
import { Chat } from '../chat.entity';
// import { Cron } from '@nestjs/schedule';
import { User } from 'src/user/entities/user.entity';

@Injectable()
export class PunishmentService {
  constructor(
    @InjectRepository(Punishment)
    private readonly PunishmentRepo: Repository<Punishment>,
  ) {}

  async isMutedInChatroom(chatID: number, id: number): Promise<boolean> {
    const mutedUsers = await this.getMutedUsers(chatID, id);
    if (mutedUsers) {
      for (const i of mutedUsers) {
        const muteTime = i.time;
        if (muteTime !== undefined) {
          const currentTime = new Date();
          console.log('start time: ', currentTime);
          console.log('mute time: ', muteTime);
          if (getTimeDiff(currentTime, muteTime) < 2) {
            return true;
          }
        }
      }
    }
    return false;
  }

  async getMutedUsers(
    chatID: number,
    id: number,
  ): Promise<Punishment[] | null> {
    const users = await this.PunishmentRepo.find({
      relations: {
        user: true,
        chat: true,
      },
      where: {
        PunishmentType: 'mute',
        user: {
          id: id,
        },
        chat: {
          id: chatID,
        },
      },
      //cache: true,
    });
    return users;
  }

  async getBannedUsers(
    chatID: number,
    user: number,
  ): Promise<Punishment[] | null> {
    const users = await this.PunishmentRepo.find({
      relations: {
        user: true,
        chat: true,
      },
      where: {
        PunishmentType: 'ban',
        user: {
          id: user,
        },
        chat: {
          id: chatID,
        },
      },
      select: {
        user: {
          username: true,
        },
        chat: {
          id: true,
          chatRoomName: true,
        },
        PunishmentType: true,
        time: true,
        id: true,
      },
    });
    return users;
  }

  async isBannedInChatroom(chatID: number, user: number): Promise<boolean> {
    const bannedUsers = await this.getBannedUsers(chatID, user);
    if (bannedUsers) {
      for (const i of bannedUsers) {
        const banTime = i.time;
        if (banTime !== undefined) {
          const currentTime = new Date();
          console.log('start time: ', currentTime);
          console.log('ban time: ', banTime);
          if (getTimeDiff(currentTime, banTime) < 2) {
            return true;
          }
        }
      }
    }
    return false;
  }
  async getChatroomPunishments(chatID: number): Promise<Punishment[]> {
    const punishments = this.PunishmentRepo.find({
      where: {
        chat: {
          id: chatID,
        },
      },
      relations: {
        user: true,
        chat: true,
      },
      select: {
        user: {
          username: true,
        },
        chat: {
          id: true,
          chatRoomName: true,
        },
        time: true,
        PunishmentType: true,
        id: true,
      },
    });
    return punishments;
  }

  async createPunishment(
    chat: Chat,
    user: User,
    punishmentDTO: createPunishmentDTO,
  ): Promise<Punishment> {
    if (validatePunishmentDto(punishmentDTO) == true) {
      const newPunishment = createPunishmenEntity(chat, user, punishmentDTO);
      return await this.PunishmentRepo.save(newPunishment);
    }
    throw new HttpException(
      'Incorrect Punishment Type.',
      HttpStatus.BAD_REQUEST,
    );
  }
  async checkIfUserBanned(chatID: number, userName: number): Promise<boolean> {
    const users = await this.getBannedUsers(chatID, userName);
    if (users.length !== 0) {
      for (const i of users) {
        const user = i.time;
        if (user !== undefined) {
          const current = new Date();
          if (getTimeDiff(current, user) < 2) {
            return true;
          }
        }
      }
    }
    return false;
  }
  async checkIfUserMuted(chatID: number, userName: number): Promise<boolean> {
    const users = await this.getMutedUsers(chatID, userName);
    if (users.length !== 0) {
      for (const i of users) {
        const user = i.time;
        if (user !== undefined) {
          const current = new Date();
          if (getTimeDiff(current, user) < 2) {
            return true;
          }
        }
      }
    }
    return false;
  }
  async getPunishmentOlderThan1H(): Promise<Punishment[]> {
    const date1hAgo = new Date(Date.now() - 1000 * (60 * 60));
    const Punishments = await this.PunishmentRepo.find({
      order: {
        time: 'ASC',
      },
      where: {
        time: LessThanOrEqual(date1hAgo),
      },
    });
    return Punishments;
  }

  async deletePunishment(id: number) {
    await this.PunishmentRepo.createQueryBuilder('Punishment')
      .delete()
      .from(Punishment)
      .where('id == :id', { id: id })
      .execute();
  }

  async clearOldPunishments() {
    const Punishments = await this.getPunishmentOlderThan1H();
    if (Object.keys(Punishments).length !== 0) {
      for (const pun of Punishments) {
        this.deletePunishment(pun.id);
      }
    }
  }

  // @Cron('0 * * * *') // runs every hour
  // async scheduledPunishmentEraser() {
  //   console.log('*\n*\n*\n*\n*\n*\nPunishments cleared\n*\n*\n*\n*\n*\n*\n');
  //   await this.clearOldPunishments();
  // }

  async clearUserPunishment(id: number, user: number, type: string) {
    const userPunishment = await this.PunishmentRepo.findOne({
      where: {
        user: {
          id: user,
        },
        PunishmentType: type,
      },
      select: {
        id: true,
      },
    });
    this.deletePunishment(userPunishment.id);
  }
}
