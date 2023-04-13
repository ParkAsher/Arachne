import { IsEmail, IsString, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    @IsString()
    nickname?: string;

    @IsString()
    profileImg?: string;

    @IsEmail({}, { message: 'email' })
    email?: string;

    @MinLength(10, { message: 'phone' })
    @MaxLength(11, { message: 'phone' })
    phone?: string;
}
