import { MailerService } from '@nestjs-modules/mailer';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class MailService {
    constructor(private readonly mailerService: MailerService) {}

    async sendAuthCode(email: string): Promise<string> {
        const randomCode = Math.random().toString().split('.')[1];
        const authCode = randomCode.substring(0, 6);

        try {
            await this.mailerService.sendMail({
                to: email,
                subject: `이메일 확인 코드: ${authCode}`,
                html: `
                <div style="border-style:solid;border-width:thin;border-color:#dadce0;border-radius:8px;padding:40px 20px" align="center">
                    <img src="https://github.com/ParkAsher/Arachne/blob/dev/src/public/images/arachne_logo_mm1.png?raw=true" width="74" height="24" aria-hidden="true" style="margin-bottom:16px" alt="Arachne">
                    <div style="font-family:'Google Sans',Roboto,RobotoDraft,Helvetica,Arial,sans-serif;border-bottom:thin solid #dadce0;color:rgba(0,0,0,0.87);line-height:32px;padding-bottom:24px;text-align:center;word-break:break-word">
                        <div style="font-size:24px">복구 이메일 확인 </div>
                    </div>
                    <div style="font-family:Roboto-Regular,Helvetica,Arial,sans-serif;font-size:14px;color:rgba(0,0,0,0.87);line-height:20px;padding-top:20px;text-align:left">
                        안녕하세요. Arachne입니다.<br><br>
                        <a style="font-weight:bold">${email}</a>
                        주소로 비밀번호 재설정 요청이 접수되었습니다.<br>
                        아래의 인증번호를 입력하여 비밀번호를 재설정 해 주세요.<br><br>
                        <div style="text-align:center;font-size:36px;margin-top:20px;line-height:44px">${authCode}
                        </div><br><br>
                        이 메일은 요청에 의해 전송되었습니다. 만약 이 요청을 기억하지 못하신다면, 당신의 계정이 위험에 처해 있을 수 있으므로 즉시 Arachne 고객센터에 연락해 주세요.<br><br>
                        코드는 3분 후 만료됩니다.<br><br>
                        감사합니다.<br>
                        <a style="font-weight:bold">Arachne 팀</a>
                    </div>
                </div>`,
            });

            return authCode;
        } catch (err) {
            throw new InternalServerErrorException(err);
        }
    }
}
