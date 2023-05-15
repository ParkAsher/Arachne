import { IsEmail, IsNotEmpty, Matches } from 'class-validator';

export class PasswordResetRequestDto {
    @IsNotEmpty()
    @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]{2,20}$/, {
        message: 'name',
    })
    name: string;

    @IsNotEmpty()
    @IsEmail({}, { message: 'email' })
    email?: string;

    @IsNotEmpty()
    @Matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{5,15}$/, {
        message: 'id',
    })
    id: string;
}
