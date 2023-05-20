import { IsEmail, IsNotEmpty } from 'class-validator';

export class SendAuthCodeDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'email' })
    email: string;
}
