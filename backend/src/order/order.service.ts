import { CartService } from './../cart/cart.service';
import { Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { NotFoundException } from '@nestjs/common';
import { OrderStatus } from '@prisma/client';
import { PaymentMethod } from '@prisma/client';
import { CartItemDto } from 'src/cart/dto/cart.dto';
import { PaypalService } from 'src/payment/paypal/paypal.service';
import { CreateOrderDto } from './dto/create-order.dto';
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { Prisma } from '@prisma/client';
import { InternalServerErrorException } from '@nestjs/common';
import { CartWithItemsDto } from 'src/cart/dto/cart.dto';
import { ProductsService } from 'src/product/products.service';
@Injectable()
export class OrderService {
    constructor(
        private readonly prismaService: PrismaService,
        private readonly cartService: CartService,
        private readonly paypalService: PaypalService,
        private readonly invoiceService: InvoiceService,
        private readonly productsService: ProductsService,
    ) {}

    processCartOrder = async (
        createOrderDto: CreateOrderDto,
    ): Promise<{
        orderId: string;
        paypalOrderId?: string;
        invoiceId?: string;
    }> => {
        return await this.prismaService.$transaction(async (prisma) => {
            const { cartId, userId, paymentMethod } = createOrderDto;
            console.log('processCartorder:', cartId, userId, paymentMethod);
            const cart = await this.cartService.getCartbyCartId(cartId);

            if (!cart || cart.items.length === 0) {
                throw new NotFoundException(
                    'Shopping cart is empty or not found.',
                );
            }
            //check if invoice exists other wise null
            const invoiceId =
                paymentMethod === PaymentMethod.INVOICE
                    ? await this.invoiceService.handleInvoice(userId, prisma)
                    : null;
            //create order for both cases
            const order = await this.createOrder(
                prisma,
                userId,
                cart,
                invoiceId,
            );

            //add order to invoice if invoice exists
            try {
                invoiceId &&
                    (await this.invoiceService.addOrderToInvoice(
                        invoiceId,
                        order.id,
                        cart.total,
                        prisma,
                    ));
                await this.productsService.updateProductsAfterOrder(cart);
            } catch (error) {
                prisma.order.update({
                    where: { id: order.id },
                    data: { status: OrderStatus.CANCELLED },
                });
                await this.productsService.updateProductAfterCancel(cart);
                console.error('Error adding order to invoice:', error);
                throw new InternalServerErrorException(
                    'Failed to add order to invoice',
                );
            }
            //create paypal order if payment method is paypal
            const paypalOrderId =
                paymentMethod === PaymentMethod.PAYPAL
                    ? await this.paypalService.handlePayPalOrder(
                          prisma,
                          userId,
                          order,
                          cart,
                      )
                    : null;

            return {
                orderId: order.id,
                paypalOrderId,
                invoiceId,
            };
        });
    };

    private async createOrder(
        prisma: Prisma.TransactionClient,
        userId: string,
        cart: CartWithItemsDto,
        invoiceId: string | null,
    ) {
        return await prisma.order.create({
            data: {
                userId: userId,
                total: cart.total,
                quantity: cart.items.reduce(
                    (sum: number, item: CartItemDto) => sum + item.quantity,
                    0,
                ),
                status: OrderStatus.PENDING,
                orderItems: {
                    create: cart.items.map((item: CartItemDto) => ({
                        productId: item.productId,
                        quantity: item.quantity,
                        price: item.product.price,
                    })),
                },
                invoiceId,
            },
        });
    }
}
