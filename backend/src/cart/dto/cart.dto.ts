import { Decimal } from '@prisma/client/runtime/library';

export class CartItemProductDto {
    id: string;
    name: string;
    price: Decimal;
    description: string;
    stock: number;
}

export class CartItemDto {
    id: string;
    shoppingCartId: string;
    productId: string;
    quantity: number;
    product: CartItemProductDto;
}

export class CartWithItemsDto {
    id: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
    total: Decimal;
    items: CartItemDto[];
}
