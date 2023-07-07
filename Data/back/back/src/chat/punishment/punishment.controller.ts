import { Controller, Get, Param, ParseIntPipe } from '@nestjs/common';
import { PunishmentService } from './punishment.service';

@Controller('punishment')
export class PunishmentController {
  constructor(private readonly punishmentService: PunishmentService) {}

  @Get('/chat/:chatID/user/:userName/ban')
  async checkIfUserBanned(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return this.punishmentService.checkIfUserBanned(chatID, userName);
  }
  @Get('/chat/:chatID/user/:userName/mute')
  async checkIfUserMuted(
    @Param('chatID', ParseIntPipe) chatID: number,
    @Param('userName') userName: string,
  ): Promise<boolean> {
    return this.punishmentService.checkIfUserMuted(chatID, userName);
  }
}
