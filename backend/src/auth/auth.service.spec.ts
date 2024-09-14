import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UserService } from 'src/user/user.service';
import { PrismaService } from 'src/prisma/prisma.service';
import {
    ConflictException,
    NotFoundException,
    UnauthorizedException,
} from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { UserRole } from '@prisma/client';
import { SignupDto } from './dto/signup.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('AuthService', () => {
    let service: AuthService;
    let jwtService: JwtService;
    let userService: UserService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AuthService,
                {
                    provide: JwtService,
                    useValue: {
                        signAsync: jest.fn(),
                    },
                },
                {
                    provide: UserService,
                    useValue: {
                        getUserByEmail: jest.fn(),
                    },
                },
                {
                    provide: PrismaService,
                    useValue: {
                        user: {
                            create: jest.fn(),
                        },
                        shoppingCart: {
                            create: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<AuthService>(AuthService);
        jwtService = module.get<JwtService>(JwtService);
        userService = module.get<UserService>(UserService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    describe('login', () => {
        it('should return a valid access token and user details on successful login', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
                role: UserRole.USER,
                firstName: 'Test',
                lastName: 'User',
                image: '',
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                mockUser,
            );
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(true as never);
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(
                'valid_token',
            );

            const result = await service.login(
                'test@example.com',
                'validpassword',
            );

            expect(result).toEqual({
                access_token: 'valid_token',
                userId: mockUser.id,
                role: mockUser.role,
            });
            expect(userService.getUserByEmail).toHaveBeenCalledWith(
                'test@example.com',
            );
            expect(bcrypt.compare).toHaveBeenCalledWith(
                'validpassword',
                mockUser.password,
            );
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
            });
        });

        it('should throw NotFoundException if user does not exist', async () => {
            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);

            await expect(
                service.login('nonexistent@example.com', 'password'),
            ).rejects.toThrow(NotFoundException);
        });

        it('should throw UnauthorizedException if password is invalid', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
                role: UserRole.USER,
                firstName: 'Test',
                lastName: 'User',
                image: '',
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                mockUser,
            );
            jest.spyOn(bcrypt, 'compare').mockResolvedValue(false as never);

            await expect(
                service.login('test@example.com', 'invalidpassword'),
            ).rejects.toThrow(UnauthorizedException);
        });
    });

    describe('signup', () => {
        it('should create a new user and return a valid access token', async () => {
            const mockUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
                role: UserRole.USER,
                firstName: 'Test',
                lastName: 'User',
                image: '',
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const signupDto: SignupDto = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'validPassword1!',
            };

            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(null);
            jest.spyOn(bcrypt, 'hash').mockResolvedValue(
                'hashedpassword' as never,
            );
            jest.spyOn(prismaService.user, 'create').mockResolvedValue(
                mockUser,
            );
            jest.spyOn(prismaService.shoppingCart, 'create').mockResolvedValue({
                id: 'cart-id',
                userId: mockUser.id,
                createdAt: new Date(),
                updatedAt: new Date(),
                total: new Decimal(0),
            });
            jest.spyOn(jwtService, 'signAsync').mockResolvedValue(
                'valid_token',
            );

            const result = await service.signup(signupDto);

            expect(result).toEqual({ access_token: 'valid_token' });
            expect(userService.getUserByEmail).toHaveBeenCalledWith(
                signupDto.email.toLowerCase(),
            );
            expect(bcrypt.hash).toHaveBeenCalledWith(signupDto.password, 10);
            expect(prismaService.user.create).toHaveBeenCalledWith({
                data: {
                    firstName: signupDto.firstName.toLowerCase(),
                    lastName: signupDto.lastName.toLowerCase(),
                    email: signupDto.email.toLowerCase(),
                    password: 'hashedpassword',
                    role: 'USER',
                },
            });
            expect(jwtService.signAsync).toHaveBeenCalledWith({
                sub: mockUser.id,
                email: mockUser.email,
                role: mockUser.role,
                shoppingCartId: 'cart-id',
            });
        });

        it('should throw ConflictException if email is already in use', async () => {
            const existingUser = {
                id: '1',
                email: 'test@example.com',
                password: 'hashedpassword',
                role: UserRole.USER,
                firstName: 'Test',
                lastName: 'User',
                image: '',
                suspended: false,
                createdAt: new Date(),
                updatedAt: new Date(),
            };

            const signupDto: SignupDto = {
                firstName: 'Test',
                lastName: 'User',
                email: 'test@example.com',
                password: 'validPassword1!',
            };

            jest.spyOn(userService, 'getUserByEmail').mockResolvedValue(
                existingUser,
            );

            await expect(service.signup(signupDto)).rejects.toThrow(
                ConflictException,
            );
        });
    });
});
