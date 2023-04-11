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

    async findUserById(id: string) {
        try {
            return await this.userRepository.find({
                select: ['id'],
                where: { id },
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserByEmail(email: string) {
        try {
            return await this.userRepository.find({
                select: ['id'],
                where: { email },
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserByNickname(nickname: string) {
        try {
            return await this.userRepository.find({
                select: ['id'],
                where: { nickname },
            });
        } catch (error) {
            throw error;
        }
    }

    async findUserByPhone(phone: string) {
        try {
            return await this.userRepository.find({
                select: ['id'],
                where: { phone },
            });
        } catch (error) {
            throw error;
        }
    }

    async signUpUser(userInfo: signupUserDto) {
        try {
            const existId = await this.findUserById(userInfo.id);
            if (existId.length) {
                throw new HttpException('id', HttpStatus.CONFLICT);
            }

            const existEmail = await this.findUserByEmail(userInfo.email);
            if (existEmail.length) {
                throw new HttpException('email', HttpStatus.CONFLICT);
            }

            const existPhone = await this.findUserByPhone(userInfo.phone);
            if (existPhone.length) {
                throw new HttpException('phone', HttpStatus.CONFLICT);
            }

            const existNickname = await this.findUserByNickname(
                userInfo.nickname,
            );
            if (existNickname.length) {
                throw new HttpException('nickname', HttpStatus.CONFLICT);
            }

            // 비밀번호 암호화
            const hashedPassword = await bcrypt.hash(userInfo.password, 10);
            userInfo.password = hashedPassword;

            await this.userRepository.save(userInfo);
        } catch (error) {
            throw error;
        }
    }
}
