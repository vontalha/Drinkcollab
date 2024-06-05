import { Address } from "nodemailer/lib/mailer";

export class SendEmailDto {
    from?: Address;
    to: Address;
    subject: string;
    html: string;
    text?: string;
    placeholderReplacement?: Record<string, string>;
}