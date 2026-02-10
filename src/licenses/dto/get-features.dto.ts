import { ApiProperty } from '@nestjs/swagger';

export class FeatureDto {
  @ApiProperty({ description: 'Feature name' })
  name!: string;

  @ApiProperty({ description: 'Feature display name' })
  displayName!: string;

  @ApiProperty({ description: 'Feature description' })
  description!: string;

  @ApiProperty({ description: 'Feature category' })
  category!: string;

  @ApiProperty({ description: 'Is premium feature' })
  isPremium!: boolean;

  @ApiProperty({ description: 'Default limits' })
  defaultLimits!: Record<string, any>;
}

export class PlanDto {
  @ApiProperty({ description: 'Plan name' })
  name!: string;

  @ApiProperty({ description: 'Plan display name' })
  displayName!: string;

  @ApiProperty({ description: 'Plan price' })
  price!: number;

  @ApiProperty({ description: 'Plan features', type: [String] })
  features!: string[];
}

export class GetFeaturesResponseDto {
  @ApiProperty({ description: 'Available features', type: [FeatureDto] })
  features!: FeatureDto[];

  @ApiProperty({ description: 'Available plans', type: [PlanDto] })
  plans!: PlanDto[];
}
