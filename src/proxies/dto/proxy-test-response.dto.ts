import { ApiProperty } from '@nestjs/swagger';

export class ProxyTestResponseDto {
  @ApiProperty({ description: 'Test status (healthy/unhealthy)' })
  status!: string;

  @ApiProperty({ description: 'Response time in milliseconds' })
  responseTime!: number;

  @ApiProperty({ description: 'Whether the proxy is working' })
  isWorking!: boolean;

  @ApiProperty({ description: 'Test execution timestamp' })
  testedAt!: Date;

  @ApiProperty({ description: 'Error message if test failed', required: false })
  error?: string;

  @ApiProperty({ description: 'Detected IP address through proxy', required: false })
  detectedIp?: string;
}
