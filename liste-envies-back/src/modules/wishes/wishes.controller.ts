import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WishesService } from './wishes.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { OptionalAuthGuard } from '../../common/guards/optional-auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { WishDto, CommentDto } from './dto/wish.dto';

@ApiTags('Wishes')
@ApiBearerAuth()
@Controller('wishes/:name')
export class WishesController {
  constructor(private readonly wishesService: WishesService) {}

  @Get()
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'List wishes for a user' })
  async getWishes(@Param('name') name: string, @User() user: any) {
    // Passer l'utilisateur complet pour appliquer les règles de filtrage
    return this.wishesService.list(user, name);
  }

  @Get(':id')
  @UseGuards(OptionalAuthGuard)
  @ApiOperation({ summary: 'Get a specific wish' })
  async getWish(
    @Param('name') name: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    return this.wishesService.getWish(user, name, parseInt(id));
  }

  @Post()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Create a wish' })
  async addWish(
    @Param('name') name: string,
    @Body() dto: WishDto,
    @User() user: any,
  ) {
    return this.wishesService.createOrUpdate(user, name, dto);
  }

  @Post(':id')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Update a wish' })
  async updateWish(
    @Param('name') name: string,
    @Param('id') id: string,
    @Body() dto: WishDto,
    @User() user: any,
  ) {
    dto.id = parseInt(id);
    return this.wishesService.createOrUpdate(user, name, dto);
  }

  @Put('give/:id')
  @UseGuards(AuthGuard)
  async giveWish(
    @Param('name') name: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    return this.wishesService.give(user, name, parseInt(id));
  }

  @Delete('give/:id')
  @UseGuards(AuthGuard)
  async cancelGiveWish(
    @Param('name') name: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    return this.wishesService.cancel(user, name, parseInt(id));
  }

  @Post(':id/addComment')
  @UseGuards(AuthGuard)
  async addComment(
    @Param('name') name: string,
    @Param('id') id: string,
    @Body() comment: CommentDto,
    @User() user: any,
  ) {
    return this.wishesService.addComment(user, name, parseInt(id), comment);
  }

  @Delete(':id')
  @UseGuards(AuthGuard)
  async deleteWish(
    @Param('name') name: string,
    @Param('id') id: string,
    @User() user: any,
  ) {
    return this.wishesService.deleteWish(user, name, parseInt(id));
  }
}
