import { Controller, Post, Body, UseGuards, Get, HttpCode, HttpStatus, Param, Delete } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountRequestService } from 'src/account-request/account-request.service';
import { Product } from '@prisma/client';
import { AddProductDto, UpdateProductDto } from 'src/product/dto/product.dto';
import { ProductsService } from 'src/product/products.service';

@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(private accountRequestService:  AccountRequestService, private productsService: ProductsService){}

    /**
     * 
     * @returns list of ids ["uuid1", "uuid2" ...]
     */

    @Get("requests")
    async getAccountRequests(){
        return this.accountRequestService.getAllRequestTokens();
    }

    /**
     * 
     * @param tokenId handler receives token id which is used to fetch token information
     * @returns if succcessfull HTTPstatus ok
     * this endpoint uses token id to fetch the token and email of RequestToken model
     * and then sends an initation link to the email containing the respective token
     */

    @Post("requests/approve/:tokenId")
    @HttpCode(HttpStatus.OK)
    async approveAccountRequest(@Param("tokenId") tokenId: string): Promise<{ status: HttpStatus; message: string }> {
        await this.accountRequestService.approveAccountRequest(tokenId)
        return {
            status: HttpStatus.OK,
            message: "Account approved!"
        }
    }

    @Post("products/update/:id")
    @HttpCode(HttpStatus.OK)
    async updateProduct(
        @Param("id") productId: string, 
        @Body() data: UpdateProductDto
    ): Promise<{ status: HttpStatus; updatedProduct: Product}>{
        const updatedProduct = await this.productsService.updateProduct(productId, data);
        return {
            status: HttpStatus.OK,
            updatedProduct
        }
    }

    @Post("products/add")
    @HttpCode(HttpStatus.OK)
    async addProduct(
        @Body() data: AddProductDto
    ): Promise<{ status: HttpStatus; newProduct: Product}>{
        const newProduct = await this.productsService.addProduct(data)
        return {
            status: HttpStatus.OK,
            newProduct
        }
    }

    @Delete("products/delete/:id")
    @HttpCode(HttpStatus.OK)
    async deleteProduct(@Param("id") productId: string): Promise<{ status: HttpStatus; message: string}>{
        await this.productsService.deleteProduct(productId)
        return {
            status: HttpStatus.OK,
            message: "Product successfully deleted!"
        }
    }    
}
