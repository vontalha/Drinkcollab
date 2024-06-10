import { Module } from '@nestjs/common';
import { DrinksService } from './drinks.service';
import { DrinksController } from './drinks.controller';
import { PrismaService } from 'src/prisma/prisma.service';
import { LikesService } from './likes.service';

@Module({
  providers: [DrinksService, PrismaService, LikesService],
  controllers: [DrinksController]
})
export class DrinksModule {}
