import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Users } from '../entities/users.entity';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Articles } from 'src/entities/articles.entity';
import { Categories } from 'src/entities/categories.entity';
import { Comments } from 'src/entities/comments.entity';

@Module({
    imports: [
        TypeOrmModule.forFeature([Users, Comments, Articles, Categories]),
    ],
    controllers: [UserController],
    providers: [UserService],
})
export class UserModule {}
