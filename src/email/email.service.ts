import { Injectable } from '@nestjs/common';
import nodemailer from 'nodemailer';

const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
        user: 'mahomedalyissumail@gmail.com',
        pass: 'uowe imji zwuf darl',
    },
});

@Injectable()
export class EmailService {
    async sendVerificationCodeEmailTo(
        destination: string,
        code: string,
    ): Promise<string> {
        const info = await transporter.sendMail({
            from: {
                address: 'mahomedalyissumail@gmail.com',
                name: 'Daily Apps',
            }, // sender address
            to: destination, // list of receivers
            subject: `Daily Todo – Verification code: ${code}`, // Subject line
            text: 'Hello world?', // plain text body
            html: this.composeHTML(code), // html body
        });
        return info.messageId;
    }

    async sendResetPasswordVerificationCode(
        destination: string,
        code: string,
    ): Promise<string> {
        const info = await transporter.sendMail({
            from: {
                address: 'mahomedalyissumail@gmail.com',
                name: 'Daily Apps',
            }, // sender address
            to: destination, // list of receivers
            subject: `Daily Todo – Password reset code: ${code}`, // Subject line
            text: 'Hello world?', // plain text body
            html: this.composeHTML2(code), // html body
        });
        return info.messageId;
    }

    private composeHTML(code: string): string {
        return `<h2>Verificar e-mail</h2>
            <p>Use este código de verificação:</p>
            <h4>${code}</h4>
            <p>Este código expira em 30 minutos.</p>
            <p>Verifique agora</p>
            <p>Se você não enviou esta solicitação, responda para nos informar.</p>`;
    }

    private composeHTML2(code: string): string {
        return `<h2>Verification code to reset password</h2>
            <p>Your reset password verification code is:</p>
            <h4>${code}</h4>
            <p>This code will expire in 30 minutes.</p>
            <p>Verify now/p>
            <p>If you didn't sent this request, plese answer as well.</p>`;
    }
}
