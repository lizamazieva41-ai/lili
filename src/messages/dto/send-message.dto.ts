import { ApiProperty } from '@nestjs/swagger';
import { IsString, IsNotEmpty, IsOptional, IsObject, IsEnum } from 'class-validator';
import { MessageType } from '@prisma/client';

export class SendMessageDto {
  @ApiProperty({ description: 'Account ID to send from' })
  @IsString()
  @IsNotEmpty()
  accountId!: string;

  @ApiProperty({ description: 'Recipient (phone number, username, or user ID)' })
  @IsString()
  @IsNotEmpty()
  recipient!: string;

  @ApiProperty({ description: 'Message content', type: Object })
  @IsObject()
  @IsNotEmpty()
  message!: {
    text: string;
    parseMode?: 'HTML' | 'Markdown' | 'MarkdownV2';
    mediaUrl?: string;
    mediaType?: string;
  };

  @ApiProperty({ description: 'Message options', type: Object, required: false })
  @IsObject()
  @IsOptional()
  options?: {
    disablePreview?: boolean;
    disableNotification?: boolean;
    replyTo?: string;
  };

  @ApiProperty({ description: 'Message type', enum: MessageType, required: false })
  @IsEnum(MessageType)
  @IsOptional()
  type?: MessageType;

  @ApiProperty({ description: 'Schedule at (ISO date string)', required: false })
  @IsOptional()
  scheduledAt?: Date;
}
