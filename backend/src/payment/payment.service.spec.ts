import { Test, TestingModule } from '@nestjs/testing';
import { PaymentService } from './payment.service';
import { PrismaService } from '../prisma/prisma.service';
import { PaymentStatus, Payment } from '@prisma/client';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Decimal } from '@prisma/client/runtime/library';

describe('PaymentService', () => {
    let service: PaymentService;
    let prismaService: PrismaService;

    beforeEach(async () => {
        const module: TestingModule = await Test.createTestingModule({
            providers: [
                PaymentService,
                {
                    provide: PrismaService,
                    useValue: {
                        payment: {
                            create: jest.fn(),
                            update: jest.fn(),
                            delete: jest.fn(),
                        },
                    },
                },
            ],
        }).compile();

        service = module.get<PaymentService>(PaymentService);
        prismaService = module.get<PrismaService>(PrismaService);
    });

    it('should be defined', () => {
        expect(service).toBeDefined();
    });

    describe('createPayment', () => {
        it('should create a new payment and return it', async () => {
            const createPaymentDto: CreatePaymentDto = {
                userId: 'user-id',
                amount: new Decimal(100),
                status: PaymentStatus.PENDING,
                method: 'INVOICE',
                orderId: 'order-id',
            };

            const mockPayment: Payment = {
                id: 'payment-id',
                userId: 'user-id',
                amount: new Decimal(100),
                status: PaymentStatus.PENDING,
                method: 'INVOICE',
                createdAt: new Date(),
                updatedAt: new Date(),
                invoiceId: null,
                paypalOrderId: null,
                orderId: 'order-id',
            };

            (prismaService.payment.create as jest.Mock).mockResolvedValue(
                mockPayment,
            );

            const result = await service.createPayment(createPaymentDto);

            expect(result).toEqual(mockPayment);
            expect(prismaService.payment.create).toHaveBeenCalledWith({
                data: {
                    ...createPaymentDto,
                },
            });
        });
    });

    describe('updatePaymentStatus', () => {
        it('should update payment status and return the updated payment', async () => {
            const paymentId = 'payment-id';
            const paymentStatus = PaymentStatus.COMPLETED;

            const mockPayment: Payment = {
                id: paymentId,
                userId: 'user-id',
                amount: new Decimal(100),
                status: PaymentStatus.COMPLETED,
                method: 'INVOICE',
                createdAt: new Date(),
                updatedAt: new Date(),
                invoiceId: null,
                paypalOrderId: null,
                orderId: null,
            };

            (prismaService.payment.update as jest.Mock).mockResolvedValue(
                mockPayment,
            );

            const result = await service.updatePaymentStatus(
                paymentId,
                paymentStatus,
            );

            expect(result).toEqual(mockPayment);
            expect(prismaService.payment.update).toHaveBeenCalledWith({
                where: { id: paymentId },
                data: {
                    status: paymentStatus,
                },
            });
        });
    });

    describe('deletePayment', () => {
        it('should delete the payment and return it', async () => {
            const paymentId = 'payment-id';

            const mockPayment: Payment = {
                id: paymentId,
                userId: 'user-id',
                amount: new Decimal(100),
                status: PaymentStatus.PENDING,
                method: 'INVOICE',
                createdAt: new Date(),
                updatedAt: new Date(),
                invoiceId: null,
                paypalOrderId: null,
                orderId: null,
            };

            (prismaService.payment.delete as jest.Mock).mockResolvedValue(
                mockPayment,
            );

            const result = await service.deletePayment(paymentId);

            expect(result).toEqual(mockPayment);
            expect(prismaService.payment.delete).toHaveBeenCalledWith({
                where: { id: paymentId },
            });
        });
    });
});
