import { IsEmail, IsNotEmpty, IsNumber } from 'class-validator';

export class CheckAuthCodeDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'email' })
    email: string;

    @IsNotEmpty()
    @IsNumber()
    authCode: number;
}
