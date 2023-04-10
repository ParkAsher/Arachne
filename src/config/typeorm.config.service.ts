import { Injectable } from '@nestjs/common';
import { TypeOrmModuleOptions, TypeOrmOptionsFactory } from '@nestjs/typeorm';
import { ConfigService } from '@nestjs/config';
import { SnakeNamingStrategy } from 'typeorm-naming-strategies';
import { Users } from 'src/entities/users.entity';
import { Articles } from 'src/entities/articles.entity';
import { Categories } from 'src/entities/categories.entity';
import { Comments } from 'src/entities/comments.entity';

@Injectable()
export class TypeOrmConfigService implements TypeOrmOptionsFactory {
    constructor(private readonly configService: ConfigService) {}
    createTypeOrmOptions():
        | TypeOrmModuleOptions
        | Promise<TypeOrmModuleOptions> {
        return {
            type: 'mysql',
            host: this.configService.get<string>('DB_HOST'),
            port: this.configService.get<number>('DB_PORT'),
            username: this.configService.get<string>('DB_USERNAME'),
            password: this.configService.get<string>('DB_PASSWORD'),
            database: this.configService.get<string>('DB_NAME'),
            entities: [Users, Articles, Categories, Comments],
            synchronize: true,
            namingStrategy: new SnakeNamingStrategy(),
            timezone: '+09:00',
            logging: false,
        };
    }
}
