import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { BadRequestException, ValidationPipe } from '@nestjs/common';
import * as cookieParser from 'cookie-parser';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';

async function bootstrap() {
    const app = await NestFactory.create<NestExpressApplication>(AppModule);

    // class-validator
    app.useGlobalPipes(
        new ValidationPipe({
            transform: true,
            exceptionFactory(errors) {
                const response = {
                    statusCode: 400,
                    statusText: 'Validation Error',
                    error: 'VALIDATION_FAILD',
                    message: errors.map((error) => error.property),
                };
                return new BadRequestException(response);
            },
        }),
    );

    // cookie-parser
    app.use(cookieParser());

    // ejs
    app.useStaticAssets(join(__dirname, '..', 'src', 'public'));
    app.setBaseViewsDir(join(__dirname, '..', 'src', 'views'));
    app.setViewEngine('ejs');

    await app.listen(process.env.PORT);
}
bootstrap();
