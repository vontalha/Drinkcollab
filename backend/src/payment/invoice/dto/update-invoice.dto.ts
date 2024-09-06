import { InvoiceStatus } from '@prisma/client';
import { IsEnum, IsNumber, IsDate, IsIn, IsOptional } from 'class-validator';

export class UpdateInvoiceDto {
    @IsEnum(InvoiceStatus)
    @IsIn([InvoiceStatus.PAID, InvoiceStatus.PENDING])
    @IsOptional()
    status?: InvoiceStatus;

    @IsNumber()
    @IsOptional()
    reminder?: number;

    @IsDate()
    @IsOptional()
    reminderDate?: Date;

    @IsDate()
    @IsOptional()
    dueDate?: Date;
}
