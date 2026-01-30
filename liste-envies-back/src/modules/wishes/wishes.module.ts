import { Module, forwardRef } from '@nestjs/common';
import { WishesController } from './wishes.controller';
import { WishesService } from './wishes.service';
import { WishListModule } from '../wish-list/wish-list.module';

@Module({
  imports: [forwardRef(() => WishListModule)],
  controllers: [WishesController],
  providers: [WishesService],
  exports: [WishesService],
})
export class WishesModule {}
