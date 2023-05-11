import { IsEmail, IsOptional, Matches } from 'class-validator';

export class UpdateUserDto {
    @IsOptional()
    @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AFa-z\d]{2,15}$/, {
        message: 'nickname',
    })
    nickname?: string;

    @IsOptional()
    @IsEmail({}, { message: 'email' })
    email?: string;
}
