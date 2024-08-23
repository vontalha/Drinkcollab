import {
    Controller,
    Get,
    Post,
    Body,
    Param,
    Res,
    UseGuards,
} from '@nestjs/common';
import { Response } from 'express';
import { CartService } from './cart.service';
import { UpdateCartItemDto } from './dto/update-cart-item.dto';
import { AddCartItemDto } from './dto/add-cart-item.dto';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';

@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
    private readonly COOKIE_MAX_AGE = 3 * 24 * 60 * 60 * 1000;

    constructor(private cartService: CartService) {}

    @Get(':userId')
    async getCart(
        @Param('userId') userId: string,
        @Res() res: Response,
    ): Promise<Response> {
        const cart = await this.cartService.getCartByUserId(userId);

        res.cookie('cartId', cart.id, {
            httpOnly: false,
            maxAge: this.COOKIE_MAX_AGE,
        });
        return res.json(cart);
    }

    @Post(':userId/add')
    async addItem(
        @Param('userId') userId: string,
        @Body() body: AddCartItemDto,
        @Res() res: Response,
    ): Promise<Response> {
        const cart = await this.cartService.addCartItem(body, userId);
        return res.json(cart);
    }

    @Post(':userId/remove')
    async removeItem(
        @Param('userId') userId: string,
        @Body() body: { productId: string },
        @Res() res: Response,
    ) {
        const cart = await this.cartService.removeItem(userId, body.productId);
        return res.json(cart);
    }

    @Post(':userId/update')
    async updateItem(
        @Param('userId') userId: string,
        @Body() body: UpdateCartItemDto,
        @Res() res: Response,
    ): Promise<Response> {
        const cart = await this.cartService.updateItemQuantity(body, userId);
        return res.json(cart);
    }
}
