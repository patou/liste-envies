import { Module } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { WishListModule } from '../wish-list/wish-list.module';

@Module({
  imports: [WishListModule],
  controllers: [WishesController],
  providers: [WishesService],
})
export class WishesModule {}
