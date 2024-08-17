import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { SearchUserDto, UpdateUserDto, UserDto } from './dto/user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { Prisma } from '@prisma/client';
@Injectable()
export class UserService {
    constructor(private prismaService: PrismaService) {}

    getUserByEmail = async (email: string) => {
        const user = await this.prismaService.user.findUnique({
            where: { email },
        });

        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    };

    getUserById = async (id: string): Promise<UserDto> => {
        const user = await this.prismaService.user.findUnique({
            where: { id },
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                password: false,
                image: true,
                role: true,
                createdAt: true,
                updatedAt: true,
                likedDrinks: true,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    };

    updateUser = async (
        id: string,
        payload: UpdateUserDto,
    ): Promise<UserDto> => {
        if (!id) {
            throw new BadRequestException('User-Id must be provided');
        }

        const existingUser = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found!');
        }

        return await this.prismaService.user.update({
            where: { id },
            data: { ...payload },
        });
    };

    deleteUser = async (id: string): Promise<UserDto> => {
        if (!id) {
            throw new BadRequestException('User-Id must be provided');
        }

        const existingUser = await this.prismaService.user.findUnique({
            where: { id },
        });

        if (!existingUser) {
            throw new NotFoundException('User not found!');
        }

        return await this.prismaService.user.delete({
            where: { id },
        });
    };

    /**
     * soll filtern könnenn nach createdAt, updatedAt
     * @returns
     */

    async getAllUsers(
        page: number,
        pageSize: number,
        sortBy: string,
        sortOrder: 'asc' | 'desc',
    ): Promise<{ data: UserDto[]; total: number; totalPages: number }> {
        const skip = (page - 1) * pageSize;
        const take = pageSize;

        const [data, total] = await this.prismaService.$transaction([
            this.prismaService.user.findMany({
                skip,
                take,
                orderBy: {
                    [sortBy]: sortOrder,
                },
                select: {
                    password: false,
                },
            }),
            this.prismaService.user.count(),
        ]);

        const totalPages = Math.ceil(total / pageSize);

        if (page > totalPages) {
            throw new BadRequestException('Page number exceeds total pages.');
        }

        return { data, total, totalPages };
    }

    searchUsers = async (query: string): Promise<SearchUserDto[]> => {
        await this.prismaService
            .$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
        const queryTerms = query
            .split(' ')
            .map((term) => term.trim())
            .filter((term) => term.length > 0);

        const whereConditions = queryTerms
            .map(
                (term) => Prisma.sql`
            (
                "email" % ${term}
                OR "role"::text % ${term}
                OR "firstName" % ${term}
                OR "lastName" % ${term}
            )
        `,
            )
            .reduce((prev, curr) => Prisma.sql`${prev} OR ${curr}`);

        const similarityCalc = queryTerms
            .map(
                (term) => Prisma.sql`
            GREATEST(
            similarity("email", ${term}),
            similarity("role"::text, ${term}),
            similarity("firstName", ${term}),
            similarity("lastName", ${term})
        )
        `,
            )
            .reduce((prev, curr) => Prisma.sql`${prev} + ${curr}`);

        const rawQuery = Prisma.sql`
            SELECT "email", "role", "firstName", "lastName",
                ${similarityCalc} AS similarity_score
            FROM "users"
            WHERE ${whereConditions}
            ORDER BY similarity_score DESC
            LIMIT 20;
        `;

        console.log(rawQuery);

        //this has to be part of the first execution to install pg_trgm for postgres
        //after first run comment out
        // await this.prismaService
        //     .$executeRaw`CREATE EXTENSION IF NOT EXISTS pg_trgm;`;
        const users =
            await this.prismaService.$queryRaw<SearchUserDto[]>(rawQuery);

        return users;
    };
}
