import { User } from 'src/user/user.entity';
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
  const newPenalty = new Punishment();
  newPenalty.chat = chat;
  newPenalty.user = user;
  newPenalty.PunishmentType = dto.type;
  return newPenalty;
}
