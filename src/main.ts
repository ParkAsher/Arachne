import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // class-validator
    app.useGlobalPipes(new ValidationPipe({ transform: true }));

    // cookie-parser
    app.use(cookieParser());

    // ejs
    app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
    app.setViewEngine('ejs');

    await app.listen(process.env.PORT);
}
bootstrap();
