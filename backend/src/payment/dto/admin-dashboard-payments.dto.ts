import {
    IsString,
    IsEnum,
    IsDate,
    IsNumber,
    ValidateNested,
} from 'class-validator';
import { Type } from 'class-transformer';
import { PaymentStatus, PaymentMethod } from '@prisma/client';
import { Decimal } from '@prisma/client/runtime/library';

class UserInfoDto {
    @IsString()
    firstName: string;

    @IsString()
    lastName: string;

    @IsString()
    email: string;
}

export class PaymentDashboardDto {
    @IsString()
    id: string;

    @IsEnum(PaymentStatus)
    status: PaymentStatus;

    @IsDate()
    createdAt: Date;

    @IsEnum(PaymentMethod)
    method: PaymentMethod;

    @IsNumber()
    amount: Decimal;

    @ValidateNested()
    @Type(() => UserInfoDto)
    user: UserInfoDto;
}
