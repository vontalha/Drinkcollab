import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { UpdateUserDto, UserDto } from './dto/user.dto';
import { NotFoundException, BadRequestException } from '@nestjs/common';
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
                password: false,
            },
        });

        if (!user) {
            throw new NotFoundException('User not found!');
        }
        return user;
    };

    updateUser = async (id: string, payload: UpdateUserDto) => {
        if (!id) {
            throw new BadRequestException('User-Id must be provided');
        }

        const existingUser = this.prismaService.user.findUnique({
            where: { id },
        });

        if (existingUser) {
            throw new NotFoundException('User not found!');
        }

        this.prismaService.user.update({
            where: { id },
            data: { ...payload },
        });
    };

    deleteUser = async (id: string) => {
        if (!id) {
            throw new BadRequestException('User-Id must be provided');
        }

        const existingUser = this.prismaService.user.findUnique({
            where: { id },
        });

        if (existingUser) {
            throw new NotFoundException('User not found!');
        }

        this.prismaService.user.delete({
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
}
