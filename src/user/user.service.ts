import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Users } from 'src/entities/users.entity';
import { Repository } from 'typeorm';
import { signupUserDto } from './dto/signup-user.dto';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UserService {
    constructor(
        @InjectRepository(Users) private userRepository: Repository<Users>,
    ) {}

    async findExistUser(column) {
        try {
            return await this.userRepository.find({
                select: ['id'],
                where: { ...column },
            });
        } catch (error) {
            throw error;
        }
    }

    async signUpUser(userInfo: signupUserDto) {
        try {
            const duplicatedCheckArray = [
                { id: userInfo.id },
                { email: userInfo.email },
                { phone: userInfo.phone },
                { nickname: userInfo.nickname },
            ];

            for (let column of duplicatedCheckArray) {
                const duplicatedUser = await this.findExistUser(column);

                if (duplicatedUser.length) {
                    throw new HttpException(
                        Object.keys(column)[0],
                        HttpStatus.CONFLICT,
                    );
                }
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(userInfo.password, 10);
            userInfo.password = hashedPassword;

            await this.userRepository.save(userInfo);
        } catch (error) {
            throw error;
        }
    }

    async getUser(userId: number) {
        const userInfo = await this.userRepository.findOne({
            select: [
                'id',
                'name',
                'email',
                'nickname',
                'phone',
                'role',
                'profileImg',
            ],
            where: { userId },
        });

        return userInfo;
    }
}
