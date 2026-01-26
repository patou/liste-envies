import {
  Controller,
  Get,
  Post,
  Delete,
  Param,
  Body,
  UseGuards,
  UnauthorizedException,
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

@ApiTags('Users')
@ApiBearerAuth()
@Controller('users')
@UseGuards(AuthGuard)
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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

  // TODO: @Get(':email/notifications') -> Needs NotificationService
  // TODO: @Get(':email/archived') -> Needs WishesService
  // TODO: @Get(':email/given') -> Needs WishesService
}
