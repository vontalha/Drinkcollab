import {
    Controller,
    Get,
    UseGuards,
    Request as Req,
    Param,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { Request } from 'express';
import { User } from '@prisma/client';
import { UserRole } from '@prisma/client';
import { InvoiceUserDashboardDto } from 'src/payment/invoice/dto/user-dashboard-invoice.dto';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentDashboardDto } from 'src/payment/dto/admin-dashboard-payments.dto';
import { OrderService } from 'src/order/order.service';

type UserInfo = {
    id: string;
    firstName: string | null;
    lastName: string | null;
    email: string | null;
    role: UserRole;
    image: string | null;
};

@Controller('user')
@UseGuards(JwtAuthGuard)
export class UserController {
    constructor(
        private readonly invoiceService: InvoiceService,
        private readonly paymentService: PaymentService,
        private readonly orderService: OrderService,
    ) {}

    @Get('me')
    async getUser(@Req() req: Request): Promise<UserInfo> {
        const user = req.user as User;
        return {
            id: user.id,
            image: user.image,
            email: user.email,
            role: user.role,
            firstName: user.firstName,
            lastName: user.lastName,
        };
    }

    @Get('invoices/:userId')
    async getUserInvoices(
        @Param('userId') userId: string,
    ): Promise<InvoiceUserDashboardDto[]> {
        return this.invoiceService.getAllInvoicesUserDashboard(userId);
    }

    @Get('payments/:userId')
    async getUserPayments(
        @Param('userId') userId: string,
    ): Promise<PaymentDashboardDto[]> {
        return this.paymentService.getAllPaymentsUserDashboard(userId);
    }

    @Get('directCheckout/:userId')
    async getDirectCheckoutOrders(@Param('userId') userId: string) {
        return this.orderService.getAllDirectCheckoutOrders(userId);
    }
}
