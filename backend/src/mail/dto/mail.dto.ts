import { Address } from "nodemailer/lib/mailer";

export class SendEmailDto {
    from?: string | Address;
    to: string| Address;
    subject: string;
    html: string;
    text?: string;
    placeholderReplacement?: Record<string, string>;
}