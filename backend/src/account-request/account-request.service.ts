import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import {v4 as uuidv4} from "uuid";


@Injectable()
export class AccountRequestService {
    constructor(private prismaService: PrismaService){}

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
}
