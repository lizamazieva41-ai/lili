import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty } from 'class-validator';

export class AssignProxyDto {
  @ApiProperty({ description: 'Proxy ID to assign', example: 'proxy_123' })
  @IsString()
  @IsNotEmpty()
  proxyId!: string;
}
