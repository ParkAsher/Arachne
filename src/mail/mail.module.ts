import { Module } from '@nestjs/common';
import { MailService } from './mail.service';
import { MailerModule } from '@nestjs-modules/mailer';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { MailerConfigService } from 'src/config/mailer.config';

@Module({
    imports: [
        MailerModule.forRootAsync({
            imports: [ConfigModule],
            useClass: MailerConfigService,
            inject: [ConfigService],
        }),
    ],
    providers: [MailService],
    exports: [MailService],
})
export class MailModule {}
