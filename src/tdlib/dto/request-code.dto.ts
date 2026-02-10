import { IsString, IsPhoneNumber, Matches } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RequestCodeDto {
  @ApiProperty({
    description: 'Phone number in international format (e.g., +1234567890)',
    example: '+1234567890',
  })
  @IsString()
  @IsPhoneNumber()
  phoneNumber: string;
}
