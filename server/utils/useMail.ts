import { createTransport } from 'nodemailer'
import { consola } from 'consola';

const { Server, Password, User, Sender } = useRuntimeConfig()

const transporter = createTransport({
    host: Server,
    port: 465,
    secure: true,
    tls: {
        ciphers: 'SSLv3',
        rejectUnauthorized: false
    },
    auth: {
        user: User,
        pass: Password
    },
});

transporter.verify((error: any) => {
    if (error) consola.error('Server is not ready to send mail');
    else consola.success('Server is ready to send mail');
});

export default async (options: any) => {
    const { recepient, subject, body } = options

    const mailOptions = {
        from: Sender,
        to: recepient,
        subject: subject,
        html: body,
    }

    transporter.sendMail(mailOptions, (error: any, info: any) => {
        if (error) consola.error('Email not sent: ' + error);
        else consola.success('Email sent: ' + info.response);
    });

};