import {
    PutObjectAclCommandInput,
    PutObjectCommand,
    PutObjectCommandInput,
    S3Client,
} from '@aws-sdk/client-s3';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import path from 'path';
import { Readable } from 'stream';

@Injectable()
export class UploadService {
    private s3: S3Client;
    private endpoint: string;
    private bucket: string;
    private region: string;

    constructor(private readonly configService: ConfigService) {
        this.region = this.configService.get<string>('S3_REGION');
        this.endpoint = this.configService.get<string>('S3_ENDPOINT');
        this.bucket = this.configService.get<string>('S3_BUCKET');

        // Naver Cloud Platform S3 연결
        this.s3 = new S3Client({
            region: this.region,
            endpoint: this.endpoint,
            credentials: {
                accessKeyId: this.configService.get<string>('S3_ACCESSKEY'),
                secretAccessKey: this.configService.get<string>('S3_SECRETKEY'),
            },
        });
    }

    async uploadProfileImage(file: Express.Multer.File, folder: string) {
        const { originalname, buffer } = file;

        const ext = path.extname(originalname);
        const basename = path.basename(originalname, ext);

        const key = `${folder}/${basename}_${Date.now()}${ext}`;

        const params: PutObjectCommandInput = {
            Bucket: this.bucket,
            Body: Readable.from(buffer),
            Key: key,
            ACL: 'public-read-write',
        };

        try {
            // S3에 이미지 저장
            await this.s3.send(new PutObjectCommand(params));

            // 저장된 이미지 주소 반환
            return `${this.endpoint}/${this.bucket}/${key}`;
        } catch (error) {
            throw error;
        }
    }
}
