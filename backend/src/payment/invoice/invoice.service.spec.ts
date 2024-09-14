import { Test, TestingModule } from '@nestjs/testing';
import { InvoiceService } from './invoice.service';
import { PrismaService } from '../../prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { InvoiceStatus } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

describe('InvoiceService', () => {
    let service: InvoiceService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                InvoiceService,
                {
                    provide: PrismaService,
                    useValue: {
                        invoice: {
                            create: jest.fn(),
                            findMany: jest.fn(),
                            findUnique: jest.fn(),
                            update: jest.fn(),
                            findFirst: jest.fn(),
                        },
                        invoiceToken: {
                            findUnique: jest.fn(),
                        },
                        order: {
                            update: jest.fn(),
                        },
                        shoppingCart: {
                            update: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<InvoiceService>(InvoiceService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createInvoice', () => {
        it('should create and return an invoice id', async () => {
            const userId = 'some-user-id';
            const mockInvoice = { id: 'some-invoice-id' };

            (prismaService.invoice.create as jest.Mock).mockResolvedValue(
                mockInvoice,
            );

            const invoiceId = await service.createInvoice(
                userId,
                prismaService,
            );

            expect(invoiceId).toBe(mockInvoice.id);
            expect(prismaService.invoice.create).toHaveBeenCalledWith({
                data: {
                    userId,
                    dueDate: expect.any(Date),
                    status: InvoiceStatus.PENDING,
                },
            });
        });
    });

    describe('getInvoiceById', () => {
        it('should return the invoice if found', async () => {
            const invoiceId = 'some-invoice-id';
            const mockInvoice = { id: invoiceId, userId: 'user-id' };

            (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(
                mockInvoice,
            );

            const result = await service.getInvoiceById(invoiceId);

            expect(result).toBe(mockInvoice);
            expect(prismaService.invoice.findUnique).toHaveBeenCalledWith({
                where: { id: invoiceId },
            });
        });

        it('should throw NotFoundException if invoice not found', async () => {
            const invoiceId = 'non-existent-id';

            (prismaService.invoice.findUnique as jest.Mock).mockResolvedValue(
                null,
            );

            await expect(service.getInvoiceById(invoiceId)).rejects.toThrow(
                NotFoundException,
            );
        });
    });

    describe('addOrderToInvoice', () => {
        it('should update invoice and order, and clear the shopping cart', async () => {
            const invoiceId = 'invoice-id';
            const orderId = 'order-id';
            const total = new Decimal(100);

            (prismaService.invoice.update as jest.Mock).mockResolvedValue({});
            (prismaService.order.update as jest.Mock).mockResolvedValue({
                userId: 'user-id',
            });
            (prismaService.shoppingCart.update as jest.Mock).mockResolvedValue(
                {},
            );

            await service.addOrderToInvoice(
                invoiceId,
                orderId,
                total,
                prismaService,
            );

            expect(prismaService.invoice.update).toHaveBeenCalledWith({
                where: { id: invoiceId },
                data: {
                    totalAmount: { increment: total },
                    orders: { connect: { id: orderId } },
                },
            });

            expect(prismaService.order.update).toHaveBeenCalledWith({
                where: { id: orderId },
                data: {
                    invoiceId,
                    status: 'COMPLETED',
                },
            });

            expect(prismaService.shoppingCart.update).toHaveBeenCalledWith({
                where: { userId: 'user-id' },
                data: {
                    items: { deleteMany: {} },
                    total: 0,
                },
            });
        });
    });

    describe('handleInvoice', () => {
        it('should create an invoice if none exists', async () => {
            const userId = 'user-id';
            const mockInvoiceId = 'new-invoice-id';

            (prismaService.invoice.findFirst as jest.Mock).mockResolvedValue(
                null,
            );
            (prismaService.invoice.create as jest.Mock).mockResolvedValue({
                id: mockInvoiceId,
            });

            const result = await service.handleInvoice(userId, prismaService);

            expect(result).toBe(mockInvoiceId);
            expect(prismaService.invoice.create).toHaveBeenCalled();
        });

        it('should return existing invoice id if it exists', async () => {
            const userId = 'user-id';
            const mockInvoice = { id: 'existing-invoice-id' };

            (prismaService.invoice.findFirst as jest.Mock).mockResolvedValue(
                mockInvoice,
            );

            const result = await service.handleInvoice(userId, prismaService);

            expect(result).toBe(mockInvoice.id);
            expect(prismaService.invoice.create).not.toHaveBeenCalled();
        });
    });
});
