import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { WishListService } from './wish-list.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { WishListDto, UserShareType } from './dto/wish-list.dto';

@ApiTags('WishList')
@ApiBearerAuth()
@Controller('list')
export class WishListController {
  constructor(private readonly wishListService: WishListService) {}

  @Get()
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get current user wish lists' })
  async getWishListForUser(@User() user: any) {
    if (!user || !user.email) {
      return [];
    }
    return this.wishListService.list(user);
  }

  @Get('of/:email')
  @UseGuards(AuthGuard)
  @ApiOperation({ summary: 'Get wish lists of another user' })
  async getWishListForOtherUser(
    @Param('email') email: string,
    @User() user: any,
  ) {
    // Retourner les listes d'un autre utilisateur, avec filtrage basé sur l'utilisateur connecté
    return this.wishListService.list({ email });
  }

  @Get('all')
  @UseGuards(AuthGuard)
  async getAllList(@User() user: any) {
    if (!user.isAdmin) throw new Error('Not Allowed'); // Should use ForbiddenException
    return this.wishListService.getAll();
  }

  @Post(':name')
  @UseGuards(AuthGuard)
  async updateWishList(
    @Param('name') name: string,
    @Body() dto: WishListDto,
    @User() user: any,
  ) {
    dto.name = name;
    return this.wishListService.createOrUpdate(user, dto);
  }

  @Post()
  @UseGuards(AuthGuard) // POST /list (Root)
  @ApiOperation({ summary: 'Create a wish list' })
  async addWishList(@Body() dto: WishListDto, @User() user: any) {
    return this.wishListService.createOrUpdate(user, dto);
  }

  @Put(':name/:newName')
  @UseGuards(AuthGuard)
  async renameWishList(
    @Param('name') name: string,
    @Param('newName') newName: string,
    @User() user: any,
  ) {
    return this.wishListService.rename(user, name, newName);
  }

  @Get(':name')
  async getOneWishList(@Param('name') name: string, @User() user?: any) {
    // Appliquer les règles de filtrage selon l'utilisateur (connecté ou anonyme)
    return this.wishListService.getOrThrow(name, user);
  }

  @Get(':name/join')
  @UseGuards(AuthGuard)
  async join(@Param('name') name: string, @User() user: any) {
    return this.wishListService.join(user, name);
  }

  @Delete(':name')
  @UseGuards(AuthGuard)
  async deleteWishList(@Param('name') name: string, @User() user: any) {
    return this.wishListService.deleteList(user, name);
  }
}
