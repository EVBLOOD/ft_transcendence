// import { User } from 'src/user/user.entity';
import { User } from 'src/user/entities/user.entity';
import { Chat } from '../chat.entity';
import { createPunishmentDTO } from './dto/createPunishment.dto';
import { Punishment } from './punishment.entity';

export function getTimeDiff(start: Date, end: Date): number {
  const msInMin = 1000 * 60;
  return Math.round(Math.abs(Number(end) - Number(start)) / msInMin);
}

export function validatePunishmentDto(dto: createPunishmentDTO): boolean {
  if (dto.type !== 'mute' && dto.type !== 'ban') {
    return false;
  }
  return true;
}

export function createPunishmenEntity(
  chat: Chat,
  user: User,
  dto: createPunishmentDTO,
): Punishment {
  const newPunishment = new Punishment();
  newPunishment.chat = chat;
  newPunishment.user = user;
  newPunishment.PunishmentType = dto.type;
  return newPunishment;
}
