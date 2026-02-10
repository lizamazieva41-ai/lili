import { ApiProperty } from '@nestjs/swagger';

export class ProxyResponseDto {
  @ApiProperty({ description: 'Proxy ID' })
  id!: string;

  @ApiProperty({ description: 'Proxy name' })
  name!: string | null;

  @ApiProperty({ description: 'Proxy type' })
  type!: string;

  @ApiProperty({ description: 'Proxy host' })
  host!: string;

  @ApiProperty({ description: 'Proxy port' })
  port!: number;

  @ApiProperty({ description: 'Country code' })
  country!: string | null;

  @ApiProperty({ description: 'Region' })
  region!: string | null;

  @ApiProperty({ description: 'Proxy status' })
  status!: string;

  @ApiProperty({ description: 'Is active' })
  isActive!: boolean;

  @ApiProperty({ description: 'Health score (0-100)' })
  healthScore!: number;

  @ApiProperty({ description: 'Response time in ms' })
  responseTime!: number | null;

  @ApiProperty({ description: 'Last checked timestamp' })
  lastChecked!: Date | null;

  @ApiProperty({ description: 'Last used timestamp' })
  lastUsedAt!: Date | null;

  @ApiProperty({ description: 'Tags', type: [String] })
  tags!: string[];

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;

  @ApiProperty({ description: 'Updated at' })
  updatedAt!: Date;
}

export class ProxyListResponseDto {
  @ApiProperty({ description: 'List of proxies', type: [ProxyResponseDto] })
  proxies!: ProxyResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
