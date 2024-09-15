import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { CreatePaymentDto } from './dto/create-payment.dto';
import { Payment, PaymentStatus } from '@prisma/client';
import { PaymentDashboardDto } from './dto/admin-dashboard-payments.dto';
@Injectable()
export class PaymentService {
    constructor(private readonly prisma: PrismaService) {}

    createPayment = async (
        createPaymentDto: CreatePaymentDto,
    ): Promise<Payment> => {
        return this.prisma.payment.create({
            data: {
                ...createPaymentDto,
            },
        });
    };

    updatePaymentStatus = async (
        paymentId: string,
        paymentStatus: PaymentStatus,
    ): Promise<Payment> => {
        return this.prisma.payment.update({
            where: { id: paymentId },
            data: {
                status: paymentStatus,
            },
        });
    };

    deletePayment = async (paymentId: string): Promise<Payment> => {
        return this.prisma.payment.delete({
            where: { id: paymentId },
        });
    };

    getAllPaymentsAdminDashboard = async (
        status?: PaymentStatus,
    ): Promise<PaymentDashboardDto[]> => {
        const where = status ? { status } : {};

        return this.prisma.payment.findMany({
            where,
            select: {
                id: true,
                status: true,
                createdAt: true,
                method: true,
                amount: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    };
    getAllPaymentsUserDashboard = async (
        userId: string,
    ): Promise<PaymentDashboardDto[]> => {
        return this.prisma.payment.findMany({
            where: { userId },
            select: {
                id: true,
                status: true,
                createdAt: true,
                method: true,
                amount: true,
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true,
                    },
                },
            },
        });
    };
}
