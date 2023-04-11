import { Matches, IsEmail, MinLength, MaxLength } from 'class-validator';

export class signupUserDto {
    @Matches(/^(?=.*[a-z])(?=.*\d)[a-z\d]{5,15}$/, {
        message: 'id',
    })
    id: string;

    @Matches(
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        { message: 'password' },
    )
    password: string;

    @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AF]{2,20}$/, {
        message: 'name',
    })
    name: string;

    @IsEmail({}, { message: 'email' })
    email: string;

    @Matches(/^[\u1100-\u11FF\u3130-\u318F\uAC00-\uD7AFa-z\d]{2,15}$/, {
        message: 'nickname',
    })
    nickname: string;

    @MinLength(10, { message: 'phone' })
    @MaxLength(11, { message: 'phone' })
    phone: string;
}
