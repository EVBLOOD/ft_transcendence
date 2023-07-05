import { Module } from '@nestjs/common';
import { PunishmentController } from './punishment.controller';
import { PunishmentService } from './punishment.service';

@Module({
  controllers: [PunishmentController],
  providers: [PunishmentService]
})
export class PunishmentModule {}
