import { IsNotEmpty, IsString } from 'class-validator';

export class signinUserDto {
    @IsNotEmpty()
    @IsString()
    id: string;

    @IsNotEmpty()
    @IsString()
    password: string;
}
