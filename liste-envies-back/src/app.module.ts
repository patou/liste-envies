import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './modules/users/users.module';
import { WishListModule } from './modules/wish-list/wish-list.module';
import { WishesModule } from './modules/wishes/wishes.module';
import { ToolsController } from './modules/tools/tools.controller';

@Module({
  imports: [ConfigModule.forRoot(), UsersModule, WishListModule, WishesModule],
  controllers: [AppController, ToolsController],
  providers: [AppService],
})
export class AppModule {}
