import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsInt, IsOptional, IsEnum, Min, Max, IsNotEmpty } from 'class-validator';

export enum ProxyType {
  HTTP = 'HTTP',
  HTTPS = 'HTTPS',
  SOCKS4 = 'SOCKS4',
  SOCKS5 = 'SOCKS5',
  SOCKS4A = 'SOCKS4A',
  SOCKS5_WITH_UDP = 'SOCKS5_WITH_UDP',
}

export class CreateProxyDto {
  @ApiProperty({ description: 'Proxy name', example: 'US Proxy 1' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ description: 'Proxy type', enum: ProxyType, example: ProxyType.SOCKS5 })
  @IsEnum(ProxyType)
  @IsNotEmpty()
  type!: ProxyType;

  @ApiProperty({ description: 'Proxy host', example: '192.168.1.100' })
  @IsString()
  @IsNotEmpty()
  host!: string;

  @ApiProperty({ description: 'Proxy port', example: 1080, minimum: 1, maximum: 65535 })
  @IsInt()
  @Min(1)
  @Max(65535)
  port!: number;

  @ApiProperty({ description: 'Proxy username', required: false })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiProperty({ description: 'Proxy password', required: false })
  @IsString()
  @IsOptional()
  password?: string;

  @ApiProperty({ description: 'Country code', example: 'US', required: false })
  @IsString()
  @IsOptional()
  country?: string;

  @ApiProperty({ description: 'Region', example: 'North America', required: false })
  @IsString()
  @IsOptional()
  region?: string;

  @ApiProperty({ description: 'Tags for grouping', type: [String], required: false })
  @IsOptional()
  tags?: string[];

  @ApiProperty({ description: 'Notes', required: false })
  @IsString()
  @IsOptional()
  notes?: string;
}
