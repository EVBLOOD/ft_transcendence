import { Module } from '@nestjs/common';
import { PunishmentController } from './punishment.controller';
import { PunishmentService } from './punishment.service';
import { Punishment } from './punishment.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([Punishment])],
  controllers: [PunishmentController],
  providers: [PunishmentService],
})
export class PunishmentModule {}
