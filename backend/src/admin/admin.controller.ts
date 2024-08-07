import { UserService } from 'src/user/user.service';
import {
    Controller,
    Post,
    Body,
    UseGuards,
    Get,
    HttpCode,
    HttpStatus,
    Param,
    Delete,
    Put,
    Query,
} from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/jwt-auth.guard';
import { RolesGuard } from 'src/common/guards/role.guard';
import { Role } from 'src/common/enums/role.enum';
import { Roles } from 'src/common/decorators/roles.decorator';
import { AccountRequestService } from 'src/account-request/account-request.service';
import { Product } from '@prisma/client';
import { AddProductDto, UpdateProductDto } from 'src/product/dto/product.dto';
import { ProductsService } from 'src/product/products.service';
import {
    PaginationProductDto,
    PaginationUserDto,
} from 'src/dto/pagination.dto';
import { ProductType } from '@prisma/client';
import { FilterDto } from 'src/dto/filter.dto';
import { SearchUserDto, UpdateUserDto, UserDto } from 'src/user/dto/user.dto';

@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private accountRequestService: AccountRequestService,
        private productsService: ProductsService,
        private userService: UserService,
    ) {}

    /**
     *
     * @returns list of ids ["uuid1", "uuid2" ...]
     */

    @Get('requests')
    async getAccountRequests() {
        return this.accountRequestService.getAllRequestTokens();
    }

    /**
     *
     * @param tokenId handler receives token id which is used to fetch token information
     * @returns if succcessfull HTTPstatus ok
     * this endpoint uses token id to fetch the token and email of RequestToken model
     * and then sends an initation link to the email containing the respective token
     */

    @Post('requests/approve/:tokenId')
    @HttpCode(HttpStatus.OK)
    async approveAccountRequest(
        @Param('tokenId') tokenId: string,
    ): Promise<{ status: HttpStatus; message: string }> {
        await this.accountRequestService.approveAccountRequest(tokenId);
        return {
            status: HttpStatus.OK,
            message: 'Account approved!',
        };
    }

    @Get('products')
    async getAllProducts(
        @Query() paginationDto: PaginationProductDto,
        @Query() filterDto: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        return this.productsService.getAllProducts(
            page,
            pageSize,
            sortBy,
            sortOrder,
            filterDto,
        );
    }

    @Get('products/search')
    async searchProducts(@Query('q') query: string): Promise<Product[]> {
        return this.productsService.searchProducts(query);
    }

    @Get('products/categories')
    async getCategories(): Promise<{ name: string; id: string }[]> {
        return await this.productsService.getCategories();
    }

    @Get('products/brands')
    async getBrands(): Promise<string[]> {
        return await this.productsService.getBrands();
    }

    @Get('products/drinks')
    async getDrinks(
        @Query() paginationDto: PaginationProductDto,
        @Query() filterDto: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const filter = { ...filterDto, type: ProductType.DRINK };

        return this.productsService.getAllProducts(
            page,
            pageSize,
            sortBy,
            sortOrder,
            filter,
        );
    }

    @Get('products/snacks')
    async getSnacks(
        @Query() paginationDto: PaginationProductDto,
        @Query() filterDto: FilterDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;
        const filter = { ...filterDto, type: ProductType.SNACK };
        return this.productsService.getAllProducts(
            page,
            pageSize,
            sortBy,
            sortOrder,
            filter,
        );
    }

    @Put('products/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateProduct(
        @Param('id') productId: string,
        @Body() data: UpdateProductDto,
    ): Promise<{ status: HttpStatus; updatedProduct: Product }> {
        const updatedProduct = await this.productsService.updateProduct(
            productId,
            data,
        );
        return {
            status: HttpStatus.OK,
            updatedProduct,
        };
    }

    @Post('products/add')
    @HttpCode(HttpStatus.OK)
    async addProduct(
        @Body() data: AddProductDto,
    ): Promise<{ status: HttpStatus; newProduct: Product }> {
        const newProduct = await this.productsService.addProduct(data);
        return {
            status: HttpStatus.OK,
            newProduct,
        };
    }

    @Delete('products/delete/:id')
    @HttpCode(HttpStatus.OK)
    async deleteProduct(
        @Param('id') productId: string,
    ): Promise<{ status: HttpStatus; message: string }> {
        await this.productsService.deleteProduct(productId);
        return {
            status: HttpStatus.OK,
            message: 'Product successfully deleted!',
        };
    }

    @Get('users')
    async getUsers(
        @Query() paginationDto: PaginationUserDto,
    ): Promise<{ data: UserDto[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;

        return this.userService.getAllUsers(page, pageSize, sortBy, sortOrder);
    }

    @Get('users/search')
    async searchUsers(@Query('q') query: string): Promise<SearchUserDto[]> {
        return this.userService.searchUsers(query);
    }

    @Get('user/:id')
    async(@Param('id') userId: string): Promise<UserDto> {
        const user = this.userService.getUserById(userId);
        return user;
    }

    @Put('user/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateUser(
        @Param('id') userId: string,
        @Body() data: UpdateUserDto,
    ): Promise<{ message: string }> {
        this.userService.updateUser(userId, data);
        return {
            message: `User with id: ${userId} has been successfully updated`,
        };
    }

    @Delete('user/delete/:id')
    @HttpCode(HttpStatus.OK)
    async deleteUser(
        @Param('id') userId: string,
    ): Promise<{ message: string }> {
        this.userService.deleteUser(userId);
        return {
            message: `User with id: ${userId} has been successfully deleted`,
        };
    }
}
