import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class PasswordResetRequestDto {
    @IsNotEmpty()
    @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AFa-z\d]{2,15}$/, {
        message: 'nickname',
    })
    nickname?: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'email' })
    email?: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{5,15}$/, {
        message: 'id',
    })
    id: string;
}
