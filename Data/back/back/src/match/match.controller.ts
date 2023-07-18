import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query } from '@nestjs/common';
import { MatchService } from './match.service';
import { CreateMatchDto } from './dto/create-match.dto';
import { UpdateMatchDto } from './dto/update-match.dto';
import { JwtAuthGuard } from 'src/authenticator/jwtauth.guard';

@Controller('match')
@UseGuards(JwtAuthGuard)
export class MatchController {
  constructor(private readonly matchService: MatchService) { }

  @Get('')
  findOne(@Req() req: any) {
    return this.matchService.getMatchHistoryView(req.new_user.sub);
  }

  @Get('all')
  find(@Req() req: any) {
    return this.matchService.getMatchHistory(req.new_user.sub);
  }

  @Get('player/:id')
  findThem(@Req() req: any, @Param('id') id: number) {
    return this.matchService.getMatchHistory(id);
  }
}
