import { ApiProperty } from '@nestjs/swagger';

export class AccountProxyDto {
  @ApiProperty({ description: 'Proxy ID' })
  id!: string;

  @ApiProperty({ description: 'Proxy name' })
  name!: string | null;

  @ApiProperty({ description: 'Proxy host' })
  host!: string;

  @ApiProperty({ description: 'Proxy country' })
  country!: string | null;
}

export class AccountResponseDto {
  @ApiProperty({ description: 'Account ID' })
  id!: string;

  @ApiProperty({ description: 'Phone number' })
  phone!: string;

  @ApiProperty({ description: 'Username', required: false })
  username!: string | null;

  @ApiProperty({ description: 'First name', required: false })
  firstName!: string | null;

  @ApiProperty({ description: 'Last name', required: false })
  lastName!: string | null;

  @ApiProperty({ description: 'Account status' })
  status!: string;

  @ApiProperty({ description: 'Activity score (0-100)' })
  activityScore!: number;

  @ApiProperty({ description: 'Reputation score' })
  reputation!: number;

  @ApiProperty({ description: 'Last active timestamp', required: false })
  lastActiveAt!: Date | null;

  @ApiProperty({ description: 'Assigned proxy', type: AccountProxyDto, required: false })
  proxy!: AccountProxyDto | null;

  @ApiProperty({ description: 'Created at' })
  createdAt!: Date;
}

export class AccountListResponseDto {
  @ApiProperty({ description: 'List of accounts', type: [AccountResponseDto] })
  accounts!: AccountResponseDto[];

  @ApiProperty({ description: 'Pagination information' })
  pagination!: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}
