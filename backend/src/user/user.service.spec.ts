import { Test, TestingModule } from '@nestjs/testing';
import { UserService } from './user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException, BadRequestException } from '@nestjs/common';
import { UserRole } from '@prisma/client';

describe('UserService', () => {
    let service: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                UserService,
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                            findMany: jest.fn(),
                            count: jest.fn(),
                        },
                        $transaction: jest.fn(),
                        $executeRaw: jest.fn(),
                        $queryRaw: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('getUserByEmail', () => {
        it('should return a user if found', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'hashedPassword',
                image: 'default.jpg',
                role: UserRole.USER,
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                mockUser,
            );

            const result = await service.getUserByEmail('test@example.com');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });
    });

    describe('getUserById', () => {
        it('should return a user if found', async () => {
            const mockUser = {
                id: '1',
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                image: 'image.png',
                role: UserRole.USER,
                createdAt: new Date(),
                updatedAt: new Date(),
                likedDrinks: [],
            };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                mockUser as any,
            );

            const result = await service.getUserById('1');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.findUnique).toHaveBeenCalledWith({
                where: { id: '1' },
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
                    shoppingCart: true,
                    suspended: true,
                },
            });
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                null,
            );

            await expect(service.getUserById('1')).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('updateUser', () => {
        it('should throw BadRequestException if id is not provided', async () => {
            await expect(service.updateUser('', {})).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                null,
            );

            await expect(service.updateUser('1', {})).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should update and return the user', async () => {
            const mockUser = {
                id: '1',
                email: 'updated@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'hashedPassword',
                image: 'default.jpg',
                role: UserRole.USER,
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                mockUser,
            );
            jest.spyOn(prismaService.user, 'update').mockResolvedValue(
                mockUser,
            );

            const payload = { email: 'updated@example.com' };
            const result = await service.updateUser('1', payload);

            expect(result).toEqual(mockUser);
            expect(prismaService.user.update).toHaveBeenCalledWith({
                where: { id: '1' },
                data: payload,
            });
        });
    });

    describe('deleteUser', () => {
        it('should throw BadRequestException if id is not provided', async () => {
            await expect(service.deleteUser('')).rejects.toThrow(
                BadRequestException,
            );
        });

        it('should throw NotFoundException if user is not found', async () => {
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                null,
            );

            await expect(service.deleteUser('1')).rejects.toThrow(
                NotFoundException,
            );
        });

        it('should delete the user', async () => {
            const mockUser = {
                id: '1',
                email: 'updated@example.com',
                firstName: 'Test',
                lastName: 'User',
                password: 'hashedPassword',
                image: 'default.jpg',
                role: UserRole.USER,
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            jest.spyOn(prismaService.user, 'findUnique').mockResolvedValue(
                mockUser,
            );
            jest.spyOn(prismaService.user, 'delete').mockResolvedValue(
                mockUser,
            );

            const result = await service.deleteUser('1');

            expect(result).toEqual(mockUser);
            expect(prismaService.user.delete).toHaveBeenCalledWith({
                where: { id: '1' },
            });
        });
    });

    describe('getAllUsers', () => {
        it('should return paginated users', async () => {
            const mockUsers = [{ id: '1', email: 'test@example.com' }];
            jest.spyOn(prismaService, '$transaction').mockResolvedValue([
                mockUsers,
                1,
            ]);

            const result = await service.getAllUsers(1, 10, 'createdAt', 'asc');

            expect(result.data).toEqual(mockUsers);
            expect(result.total).toBe(1);
            expect(result.totalPages).toBe(1);
            expect(prismaService.user.findMany).toHaveBeenCalled();
            expect(prismaService.user.count).toHaveBeenCalled();
        });

        it('should throw BadRequestException if page number exceeds total pages', async () => {
            jest.spyOn(prismaService, '$transaction').mockResolvedValue([
                [],
                0,
            ]);

            await expect(
                service.getAllUsers(2, 10, 'createdAt', 'asc'),
            ).rejects.toThrow(BadRequestException);
        });
    });

    describe('searchUsers', () => {
        it('should search and return users based on the query', async () => {
            const mockUsers = [
                {
                    email: 'test@example.com',
                    role: 'USER',
                    firstName: 'Test',
                    lastName: 'User',
                },
            ];
            jest.spyOn(prismaService, '$queryRaw').mockResolvedValue(mockUsers);
            jest.spyOn(prismaService, '$executeRaw').mockResolvedValue(
                undefined,
            );

            const result = await service.searchUsers('test');

            expect(result).toEqual(mockUsers);
            expect(prismaService.$executeRaw).toHaveBeenCalledWith([
                'CREATE EXTENSION IF NOT EXISTS pg_trgm;',
            ]);
            expect(prismaService.$queryRaw).toHaveBeenCalled();
        });
    });
});
