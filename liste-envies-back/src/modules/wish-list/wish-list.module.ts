import { Module } from '@nestjs/common';
import { WishListController } from './wish-list.controller';
import { WishListService } from './wish-list.service';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [UsersModule],
  controllers: [WishListController],
  providers: [WishListService],
  exports: [WishListService],
})
export class WishListModule {}
