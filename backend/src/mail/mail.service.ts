import { Injectable } from '@nestjs/common';
import * as nodemailer from "nodemailer"
import { SendEmailDto } from './dto/mail.dto';
import { Transporter } from 'nodemailer';
@Injectable()
export class MailService {
    private transporter: Transporter;

  constructor() {
    this.transporter = nodemailer.createTransport({
      host: process.env.MAIL_HOST,
      port: Number(process.env.MAIL_PORT),
      secure: false, // true for 465, false for other ports
      auth: {
        user: process.env.MAIL_USER,
        pass: process.env.MAIL_PASSWORD,
      },
    });
  }

  async sendMail(sendEmailDto: SendEmailDto): Promise<void> {
    // async sendTestMail(): Promise<void> {

    const { to, subject, text, html } = sendEmailDto;

    const mailOptions = {
      from: process.env.MAIL_FROM, // Sender address
      to,
      subject,
      text,
      html,
    };

    // const mailOptions = {
    //     from: process.env.MAIL_FROM, 
    //     to: 'Drinkcollab.tud@gmail.com', 
    //     subject: 'Test Email', 
    //     text: 'This is a test email sent from Nodemailer', 
    //     html: '<b>This is a test email sent from Nodemailer</b>', 
    // };
    await this.transporter.sendMail(mailOptions);
  }

}
