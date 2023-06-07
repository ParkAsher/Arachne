import { MailerOptions, MailerOptionsFactory } from '@nestjs-modules/mailer';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class MailerConfigService implements MailerOptionsFactory {
    constructor(private readonly configsService: ConfigService) {}

    createMailerOptions(): MailerOptions {
        return {
            transport: {
                service: 'gmail',
                auth: {
                    user: this.configsService.get<string>(
                        'ARACHNE_MAIL_ADDRESS',
                    ),
                    pass: this.configsService.get<string>(
                        'ARACHNE_MAIL_PASSWORD',
                    ),
                },
            },
            defaults: {
                from: {
                    address: this.configsService.get<string>(
                        'ARACHNE_MAIL_ADDRESS',
                    ),
                    name: this.configsService.get<string>('ARACHNE_MAIL_NAME'),
                },
            },
        };
    }
}
