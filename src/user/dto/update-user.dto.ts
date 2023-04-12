import { IsEmail, MaxLength, MinLength } from 'class-validator';

export class UpdateUserDto {
    nickname?: string;

    profileImg?: string;

    @IsEmail({}, { message: 'email' })
    email?: string;

    @MinLength(10, { message: 'phone' })
    @MaxLength(11, { message: 'phone' })
    phone?: string;
}
