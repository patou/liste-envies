import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
  NotFoundException,
} from '@nestjs/common';
import {
  ApiTags,
  ApiBearerAuth,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';
import { UsersService } from './users.service';
import { AuthGuard } from '../../common/guards/auth.guard';
import { User } from '../../common/decorators/user.decorator';
import { CreateUserDto } from './dto/user.dto';
import { NotificationsService } from '../notifications/notifications.service';
import { WishesService } from '../wishes/wishes.service';

@ApiTags('Users')
@ApiBearerAuth()
@Controller(['users', 'utilisateur'])
@UseGuards(AuthGuard)
export class UsersController {
  constructor(
    private readonly usersService: UsersService,
    private readonly notificationsService: NotificationsService,
    private readonly wishesService: WishesService,
  ) {}

  @Get()
  @ApiOperation({ summary: 'List all users (Admin)' })
  async getAppUsers() {
    // Original: List all users.
    // Optimization: Check if this should be admin only? Java code lists all but requires auth.
    return this.usersService.getAll();
  }

  @Get('my')
  @ApiOperation({ summary: 'Get current user profile' })
  async getMyAccount(@User() user: any) {
    // user comes from Firebase token. We need to fetch full profile from DB.
    return this.usersService.findByEmail(user.email);
  }

  @Post(':email')
  @ApiOperation({ summary: 'Create or update a user (Admin)' })
  async addUser(
    @Param('email') email: string,
    @Body() createUserDto: CreateUserDto,
    @User() currentUser: any,
  ) {
    const adminUser = await this.usersService.findByEmail(currentUser.email);
    if (!adminUser?.isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }
    return this.usersService.createOrUpdate(email, createUserDto);
  }

  @Get(':email')
  @ApiOperation({ summary: 'Get user by email' })
  async getUser(@Param('email') email: string) {
    return this.usersService.findByEmail(email);
  }

  @Delete(':email')
  @ApiOperation({ summary: 'Delete a user (Admin)' })
  async deleteUser(@Param('email') email: string, @User() currentUser: any) {
    const adminUser = await this.usersService.findByEmail(currentUser.email);
    if (!adminUser?.isAdmin) {
      throw new UnauthorizedException('Admin access required');
    }
    return this.usersService.delete(email);
  }

  @Get(':email/notifications')
  @ApiOperation({ summary: 'Get user notifications' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of notifications for the user',
    type: [Object],
  })
  @ApiResponse({ status: 404, description: 'User not found' })
  async getUserNotifications(
    @Param('email') email: string,
    @User() currentUser: any,
  ) {
    // Support 'me' as alias for current user
    const targetEmail = email === 'me' ? currentUser.email : email;

    const user = await this.usersService.findByEmail(targetEmail);
    if (!user) {
      throw new NotFoundException('User not found');
    }
    return this.notificationsService.list(user);
  }

  @Get(':email/archived')
  @ApiOperation({ summary: 'Get archived wishes for user' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of archived wishes received by the user',
    type: [Object],
  })
  async getArchivedWishes(
    @Param('email') email: string,
    @User() currentUser: any,
  ) {
    // Support 'me' as alias for current user
    const targetEmail = email === 'me' ? currentUser.email : email;
    return this.wishesService.archived(targetEmail);
  }

  @Get(':email/given')
  @ApiOperation({ summary: 'Get wishes given by user' })
  @ApiResponse({
    status: 200,
    description: 'Returns list of wishes given by the user',
    type: [Object],
  })
  async getGivenWishes(
    @Param('email') email: string,
    @User() currentUser: any,
  ) {
    // Support 'me' as alias for current user
    const targetEmail = email === 'me' ? currentUser.email : email;
    return this.wishesService.given(targetEmail);
  }
}
