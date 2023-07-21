import { Module } from '@nestjs/common';
import { PunishmentController } from './punishment.controller';
import { PunishmentService } from './punishment.service';
import { Punishment } from './punishment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PunishmentGateway } from './punishment.gateway';
import { ChatModule } from '../chat.module';
import { ScheduleModule } from '@nestjs/schedule';

@Module({
  imports: [
    TypeOrmModule.forFeature([Punishment]),
    ChatModule,
    ScheduleModule.forRoot(),
  ],
  controllers: [PunishmentController],
  providers: [PunishmentService, PunishmentGateway],
})
export class PunishmentModule {}
