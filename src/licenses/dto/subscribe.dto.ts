import { ApiProperty } from '@nestjs/swagger';
import { IsEnum, IsNotEmpty, IsOptional, IsBoolean, IsString } from 'class-validator';
import { LicensePlan, BillingCycle } from '@prisma/client';

export class SubscribeDto {
  @ApiProperty({ description: 'License plan', enum: LicensePlan })
  @IsEnum(LicensePlan)
  @IsNotEmpty()
  plan!: LicensePlan;

  @ApiProperty({ description: 'Billing cycle', enum: BillingCycle })
  @IsEnum(BillingCycle)
  @IsNotEmpty()
  billingCycle!: BillingCycle;

  @ApiProperty({ description: 'Auto renew', required: false })
  @IsBoolean()
  @IsOptional()
  autoRenew?: boolean;

  @ApiProperty({ description: 'Payment method ID', required: false })
  @IsString()
  @IsOptional()
  paymentMethodId?: string;
}
