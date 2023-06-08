import { IsEmail, IsNotEmpty, IsString, Matches } from 'class-validator';

export class PasswordResetDto {
    @IsNotEmpty()
    @IsEmail({}, { message: 'email' })
    email: string;

    @IsNotEmpty()
    @IsString()
    newPassword: string;
}
