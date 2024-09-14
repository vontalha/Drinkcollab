import { Test, TestingModule } from '@nestjs/testing';
import { AccountRequestService } from './account-request.service';
import { PrismaService } from 'src/prisma/prisma.service';
import { MailService } from 'src/mail/mail.service';
import { v4 as uuidv4 } from 'uuid';

jest.mock('uuid');

describe('AccountRequestService', () => {
    let service: AccountRequestService;
    let prismaService: PrismaService;
    let mailService: MailService; // eslint-disable-line

    const originalConsoleError = console.error;

    beforeEach(async () => {
        jest.spyOn(console, 'error').mockImplementation(() => {});

        const module: TestingModule = await Test.createTestingModule({
            providers: [
                AccountRequestService,
                {
                    provide: PrismaService,
                    useValue: {
                        requestToken: {
                            create: jest.fn(),
                            delete: jest.fn(),
                            findFirst: jest.fn(),
                            findUnique: jest.fn(),
                            findMany: jest.fn(),
                        },
                    },
                },
                {
                    provide: MailService,
                    useValue: {
                        sendMail: jest.fn(),
                    },
                },
            ],
        }).compile();

        service = module.get<AccountRequestService>(AccountRequestService);
        prismaService = module.get<PrismaService>(PrismaService);
        mailService = module.get<MailService>(MailService);
    });

    afterEach(() => {
        jest.clearAllMocks();
        console.error = originalConsoleError;
    });

    describe('createRequestToken', () => {
        it('should create a new request token and delete any existing one', async () => {
            const mockEmail = 'test@example.com';
            const mockToken = 'mocked-uuid-token';
            (uuidv4 as jest.Mock).mockReturnValue(mockToken);

            const existingToken = {
                id: 'existing-token-id',
                email: 'test@example.com',
                token: 'existing-token',
                expires: new Date(),
            };
            jest.spyOn(service, 'getRequestTokenByMail').mockResolvedValue(
                existingToken,
            );

            await service.createRequestToken(mockEmail);

            expect(service.getRequestTokenByMail).toHaveBeenCalledWith(
                mockEmail,
            );
            expect(prismaService.requestToken.delete).toHaveBeenCalledWith({
                where: { id: existingToken.id },
            });
            expect(prismaService.requestToken.create).toHaveBeenCalledWith({
                data: {
                    email: mockEmail,
                    token: mockToken,
                    expires: expect.any(Date),
                },
            });
        });

        it('should create a new request token if no existing token is found', async () => {
            const mockEmail = 'test@example.com';
            const mockToken = 'mocked-uuid-token';
            (uuidv4 as jest.Mock).mockReturnValue(mockToken);

            jest.spyOn(service, 'getRequestTokenByMail').mockResolvedValue(
                null,
            );

            await service.createRequestToken(mockEmail);

            expect(service.getRequestTokenByMail).toHaveBeenCalledWith(
                mockEmail,
            );
            expect(prismaService.requestToken.delete).not.toHaveBeenCalled();
            expect(prismaService.requestToken.create).toHaveBeenCalledWith({
                data: {
                    email: mockEmail,
                    token: mockToken,
                    expires: expect.any(Date),
                },
            });
        });

        it('should throw an error if creating the request token fails', async () => {
            const mockEmail = 'test@example.com';
            jest.spyOn(service, 'getRequestTokenByMail').mockRejectedValue(
                new Error('Error'),
            );

            await expect(service.createRequestToken(mockEmail)).rejects.toThrow(
                Error,
            );
        });
    });

    describe('getRequestTokenByMail', () => {
        it('should return the request token if found', async () => {
            const mockToken = {
                id: 'token-id',
                email: 'test@example.com',
                token: 'mock-token',
                expires: new Date(),
            };
            jest.spyOn(
                prismaService.requestToken,
                'findFirst',
            ).mockResolvedValue(mockToken);

            const result =
                await service.getRequestTokenByMail('test@example.com');

            expect(result).toEqual(mockToken);
            expect(prismaService.requestToken.findFirst).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return null if no request token is found', async () => {
            jest.spyOn(
                prismaService.requestToken,
                'findFirst',
            ).mockResolvedValue(null);

            const result =
                await service.getRequestTokenByMail('test@example.com');

            expect(result).toBeNull();
            expect(prismaService.requestToken.findFirst).toHaveBeenCalledWith({
                where: { email: 'test@example.com' },
            });
        });

        it('should return null if there is an error fetching the token', async () => {
            jest.spyOn(
                prismaService.requestToken,
                'findFirst',
            ).mockRejectedValue(new Error('Error'));

            const result =
                await service.getRequestTokenByMail('test@example.com');

            expect(result).toBeNull();
        });
    });

    describe('getRequestTokenByToken', () => {
        it('should return the request token if found', async () => {
            const mockToken = {
                id: 'token-id',
                email: 'test@example.com',
                token: 'mock-token',
                expires: new Date(),
            };
            jest.spyOn(
                prismaService.requestToken,
                'findUnique',
            ).mockResolvedValue(mockToken);

            const result = await service.getRequestTokenByToken('mocked-token');

            expect(result).toEqual(mockToken);
            expect(prismaService.requestToken.findUnique).toHaveBeenCalledWith({
                where: { token: 'mocked-token' },
            });
        });

        it('should return null if no request token is found', async () => {
            jest.spyOn(
                prismaService.requestToken,
                'findUnique',
            ).mockResolvedValue(null);

            const result = await service.getRequestTokenByToken('mocked-token');

            expect(result).toBeNull();
            expect(prismaService.requestToken.findUnique).toHaveBeenCalledWith({
                where: { token: 'mocked-token' },
            });
        });

        it('should return null if there is an error fetching the token', async () => {
            jest.spyOn(
                prismaService.requestToken,
                'findUnique',
            ).mockRejectedValue(new Error('Error'));

            const result = await service.getRequestTokenByToken('mocked-token');

            expect(result).toBeNull();
        });
    });
    describe('getAllRequestTokens', () => {
        it('should return an array of token objects with id and email', async () => {
            const mockTokens = [
                {
                    id: 'token-1',
                    email: 'test1@example.com',
                    token: 'mock-token-1',
                    expires: new Date(),
                },
                {
                    id: 'token-2',
                    email: 'test2@example.com',
                    token: 'mock-token-2',
                    expires: new Date(),
                },
            ];
            jest.spyOn(
                prismaService.requestToken,
                'findMany',
            ).mockResolvedValue(mockTokens);

            const result = await service.getAllRequestTokens();

            const expectedResult = mockTokens.map((token) => ({
                id: token.id,
                email: token.email,
            }));

            expect(result).toEqual(expectedResult);
            expect(prismaService.requestToken.findMany).toHaveBeenCalledWith({
                select: { id: true, email: true },
            });
        });
    });
});
