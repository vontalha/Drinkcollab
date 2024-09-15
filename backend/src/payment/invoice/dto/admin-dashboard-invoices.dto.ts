import { Decimal } from '@prisma/client/runtime/library';
import { InvoiceStatus } from '@prisma/client';
import { IsString, IsEmail, IsDate, IsEnum, IsDecimal } from 'class-validator';

class UserInfoDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsEmail()
    email: string;
}

export class AdminDashboardInvoiceDto {
    @IsString()
    id: string;

    @IsDate()
    dueDate: Date;

    @IsDecimal()
    totalAmount: Decimal;

    @IsEnum(InvoiceStatus)
    status: InvoiceStatus;

    user: UserInfoDto;
}
