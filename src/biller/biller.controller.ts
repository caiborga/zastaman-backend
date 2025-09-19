import { Controller, Get, Post, Body, Request, Patch } from '@nestjs/common';
import { BillerService } from './biller.service';
import { CreateBillerDto } from './dto/create-biller.dto';
import { UpdateBillerDto } from './dto/update-biller.dto';

@Controller('biller')
export class BillerController {
  constructor(private readonly billerService: BillerService) {}

  @Post()
  create(@Body() dto: CreateBillerDto, @Request() req) {
    return this.billerService.create(dto, req.user);
  }

  @Get()
  getOwn(@Request() req) {
    return this.billerService.findByUser(req.user.userId);
  }

  @Patch()
  update(@Body() dto: UpdateBillerDto, @Request() req) {
    return this.billerService.update(dto, req.user);
  }
}
