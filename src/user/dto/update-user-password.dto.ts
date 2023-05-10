import { Matches } from 'class-validator';

export class updateUserPasswordDto {
    @Matches(
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        { message: 'currentPassword' },
    )
    currentPassword: string;

    @Matches(
        /^(?=.*[a-z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>])[A-Za-z\d!@#$%^&*(),.?":{}|<>]{8,}$/,
        { message: 'newPassword' },
    )
    newPassword: string;
}
