import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, Req, Query, ClassSerializerInterceptor, UseInterceptors, ParseIntPipe } from '@nestjs/common';
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
  findThem(@Req() req: any, @Param('id', ParseIntPipe) id: number) {
    return this.matchService.getMatchHistory(id);
  }

  @Get('leadring')
  async leadring() {
    return await this.matchService.getLeadering();
  }

  @Get('leadringFIRST')
  async leadring_() {
    return await this.matchService.getLeadering_();
  }


  @Get('leader/:id')
  async leadr(@Param('id', ParseIntPipe) id: number) {
    return await this.matchService.getMyLeadering(id);
  }

  @Get('Ilead')
  async Ilead(@Req() req: any) {
    return await this.matchService.getMyLeadering(req.new_user.sub);
  }

  @Get('play/:id')
  async playerCounter(@Req() req: any, @Param('id', ParseIntPipe) id) {
    return await this.matchService.getWinnCalc(req.new_user.sub, id)
  }
  @Get('playU/:id')
  async playerCounterU(@Req() req: any, @Param('id', ParseIntPipe) id) {
    return await this.matchService.getWinnCalc(id, req.new_user.sub)
  }
}
