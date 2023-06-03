import { IsNotEmpty, IsString, IsEmail } from 'class-validator';

export class FindUserIdDto {
    @IsNotEmpty()
    @IsString()
    name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;
}
