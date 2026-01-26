import { Injectable } from '@nestjs/common';
import { BaseRepository } from '../../common/repository/base.repository';
import { UserDto, CreateUserDto } from './dto/user.dto';

export interface AppUserEntity {
  email: string;
  name: string;
  picture: string;
  birthday: string;
  isAdmin: boolean;
}

@Injectable()
export class UsersService extends BaseRepository<AppUserEntity> {
  constructor() {
    super('AppUser');
  }

  async getAll(): Promise<UserDto[]> {
    const entities = await super.getAll();
    return entities.map((e) => this.mapToDto(e));
  }

  async findByEmail(email: string): Promise<UserDto | null> {
    const entity = await this.get(email);
    if (!entity) return null;
    return this.mapToDto(entity);
  }

  async createOrUpdate(email: string, dto: CreateUserDto): Promise<UserDto> {
    let existing = await this.get(email);

    const entity: AppUserEntity = {
      email: email,
      name: dto.name || existing?.name || '',
      picture: dto.picture || existing?.picture || '',
      birthday: dto.birthday || existing?.birthday || '',
      isAdmin: existing?.isAdmin || false,
    };

    await this.save(entity, email);
    return this.mapToDto(entity);
  }

  private mapToDto(entity: AppUserEntity): UserDto {
    return {
      email: entity.email,
      name: entity.name,
      picture: entity.picture,
      birthday: entity.birthday,
      isNewUser: !entity.name,
      isAdmin: entity.isAdmin,
    };
  }
}
