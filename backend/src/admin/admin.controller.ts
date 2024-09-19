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
    UsePipes,
    ValidationPipe,
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
import { InvoiceService } from 'src/payment/invoice/invoice.service';
import { UpdateInvoiceDto } from 'src/payment/invoice/dto/update-invoice.dto';
import { InvoiceStatus } from '@prisma/client';
import { AddCategoryDto } from 'src/product/dto/product.dto';
import { Category } from '@prisma/client';
import { PaymentService } from 'src/payment/payment.service';
import { PaymentStatus } from '@prisma/client';
import { PaymentDashboardDto } from 'src/payment/dto/admin-dashboard-payments.dto';
import { AdminDashboardInvoiceDto } from 'src/payment/invoice/dto/admin-dashboard-invoices.dto';
import { PaginationSearchDto } from 'src/dto/pagination.dto';
@Roles(Role.Admin)
@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('admin')
export class AdminController {
    constructor(
        private accountRequestService: AccountRequestService,
        private productsService: ProductsService,
        private userService: UserService,
        private invoiceService: InvoiceService,
        private paymentService: PaymentService,
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
    @UsePipes(new ValidationPipe({ transform: true }))
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
    @UsePipes(new ValidationPipe({ transform: true }))
    async searchProducts(
        @Query() paginationProdcuctSearchDto: PaginationSearchDto,
    ): Promise<{ data: Product[]; total: number; totalPages: number }> {
        const { query, page, pageSize } = paginationProdcuctSearchDto;

        return this.productsService.searchProducts(query, page, pageSize);
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
    @UsePipes(new ValidationPipe({ transform: true }))
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
    @UsePipes(new ValidationPipe({ transform: true }))
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

    @Post('products/categories/add')
    @HttpCode(HttpStatus.OK)
    async addCategory(
        @Body() data: AddCategoryDto,
    ): Promise<{ status: HttpStatus; newCategory: Category }> {
        const newCategory = await this.productsService.addCategory(data);
        return {
            status: HttpStatus.OK,
            newCategory,
        };
    }

    @Get('users')
    @UsePipes(new ValidationPipe({ transform: true }))
    async getUsers(
        @Query() paginationDto: PaginationUserDto,
    ): Promise<{ data: UserDto[]; total: number; totalPages: number }> {
        const { page, pageSize, sortBy, sortOrder } = paginationDto;

        return this.userService.getAllUsers(page, pageSize, sortBy, sortOrder);
    }

    @Get('users/search')
    @UsePipes(new ValidationPipe({ transform: true }))
    async searchUsersarch(
        @Query() paginationSearch: PaginationSearchDto,
    ): Promise<{ data: SearchUserDto[]; total: number; totalPages: number }> {
        const { query, page, pageSize } = paginationSearch;

        return this.userService.searchUsers(query, page, pageSize);
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

    @Get('invoices')
    async getInvoices(
        @Query('status') status?: InvoiceStatus,
    ): Promise<AdminDashboardInvoiceDto[]> {
        return this.invoiceService.getAllInvoicesAdminDashboard(status);
    }

    @Put('invoice/update/:id')
    @HttpCode(HttpStatus.OK)
    async updateInvoice(
        @Param('id') invoiceId: string,
        @Body() data: UpdateInvoiceDto,
    ): Promise<{ message: string }> {
        this.invoiceService.updateInvoice(invoiceId, data);
        return {
            message: `Invoice with id: ${invoiceId} has been successfully updated`,
        };
    }

    @Get('payments')
    async getPayments(
        @Query('status') status?: PaymentStatus,
    ): Promise<PaymentDashboardDto[]> {
        return this.paymentService.getAllPaymentsAdminDashboard(status);
    }
}
