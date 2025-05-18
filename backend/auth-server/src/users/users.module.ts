import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Role, RoleSchema } from '../roles/schemas/role.schema'; // ✅ 추가
import { User, UserSchema } from './schemas/user.schema';
import { InternalUsersController, UsersController } from './users.controller';
import { UsersService } from './users.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      { name: User.name, schema: UserSchema },
      { name: Role.name, schema: RoleSchema },
    ]),
  ],
  providers: [UsersService],
  controllers: [UsersController, InternalUsersController],
  exports: [UsersService],
})
export class UsersModule {}
