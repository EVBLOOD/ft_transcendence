import { Injectable } from '@nestjs/common';
import { Repository } from 'typeorm';
import { Punishment } from './punishment.entity';
import { getTimeDiff } from './punishment.utils';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class PunishmentService {
  constructor(
    @InjectRepository(Punishment)
    private readonly PunishmentRepo: Repository<Punishment>,
  ) {}

  async isMutedInChatroom(chatID: number, user: string): Promise<boolean> {
    const mutedUsers = await this.getMutedUsers(chatID, user);
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
    user: string,
  ): Promise<Punishment[] | null> {
    const users = await this.PunishmentRepo.find({
      relations: {
        user: true,
        chat: true,
      },
      where: {
        PunishmentType: 'mute',
        user: {
          userName: user,
        },
        chat: {
          id: chatID,
        },
      },
      cache: true,
    });
    return users;
  }

  async getBannedUsers(
    chatID: number,
    user: string,
  ): Promise<Punishment[] | null> {
    const users = await this.PunishmentRepo.find({
      relations: {
        user: true,
        chat: true,
      },
      where: {
        PunishmentType: 'ban',
        user: {
          userName: user,
        },
        chat: {
          id: chatID,
        },
      },
      select: {
        user: {
          userName: true,
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

  async isBannedInChatroom(chatID: number, user: string): Promise<Boolean> {
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
}
