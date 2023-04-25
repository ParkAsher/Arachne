import {
    IsEmail,
    IsString,
    MaxLength,
    MinLength,
    IsNumber,
} from 'class-validator';

export class BackUpdateUserDto {
    @IsString()
    id?: string;

    @IsString()
    password?: string;

    @IsString()
    name?: string;

    @IsString()
    nickname?: string;

    @IsString()
    profileImg?: string;

    @IsEmail({}, { message: 'email' })
    email?: string;

    @MinLength(10, { message: 'phone' })
    @MaxLength(11, { message: 'phone' })
    phone?: string;

    @IsNumber()
    role?: number;
}
