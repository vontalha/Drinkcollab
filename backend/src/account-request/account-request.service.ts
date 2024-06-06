import { MailService } from './../mail/mail.service';
import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { SendEmailDto } from 'src/mail/dto/mail.dto';
import { PrismaService } from 'src/prisma/prisma.service';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class AccountRequestService {
  constructor(private prismaService: PrismaService, private mailservice: MailService) {}

	createRequestToken = async (email: string) => {
		try {
			const existingToken = await this.getRequestTokenByMail(email);

			if (existingToken) {
				await this.prismaService.requestToken.delete({
				where: {
					id: existingToken.id,
				},
			});
		}

		const token = uuidv4();
		const expires = new Date(new Date().getTime() + 3600 * 1000);

		await this.prismaService.requestToken.create({
			data: {
				email,
				token,
				expires,
			},
		});
		} catch (error) {
			console.error('Error creating request token:', error);
			throw error;
		}
	};

	getRequestTokenByMail = async (email: string) => {
		try {
			const requestToken = await this.prismaService.requestToken.findFirst({
				where: { email },
			});
			return requestToken;
		} catch (error) {
			console.error('Error fetching request token by email:', error);
			return null;
		}
	};

	getRequestTokenByToken = async (token: string) => {
		try {
			const requestToken = await this.prismaService.requestToken.findUnique({
				where: { token },
			});
			return requestToken;
		} catch (error) {
			console.error('Error fetching request token by given token:', error);
			return null;
		}
	};

	getAllRequestTokens = async () => {
		const tokenIds = await this.prismaService.requestToken.findMany({
			select: {
				id: true,
			}	
		})
		return tokenIds.map(token => token.id);
	}

	approveAccountRequest = async (tokenId: string) => {
		const existingToken = await this.prismaService.requestToken.findUnique({
			where: {id: tokenId}
		})

		if (!existingToken) {
			throw new NotFoundException("Token not found!")
		}

		const inviteLink = `Http://localhost:3000/account-request/approved?token=${existingToken.token}`

		const mailOptions: SendEmailDto = {
			from: process.env.MAIL_FROM,
			to: existingToken.email,
			subject: "Your Drinkcollab account request got approved!",
			html: `
				<h1>Your Account Request got approved!</h1>
				</br> 
				<p>Click <a href=${inviteLink}>here</a> to create a Drinkcollab account</p>`
		}

		try {
			await this.mailservice.sendMail(mailOptions);
		} catch (error) {
			console.error('Error sending email:', error);
			throw new InternalServerErrorException('Failed to send approval email');
		}
	}
}
