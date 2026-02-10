import { ApiProperty } from '@nestjs/swagger';

export class ChatResponseDto {
  @ApiProperty({ description: 'Chat ID', example: 123456789 })
  id: number;

  @ApiProperty({ description: 'Chat type', example: 'private' })
  type: string;

  @ApiProperty({ description: 'Chat title', example: 'John Doe', required: false })
  title?: string;

  @ApiProperty({ description: 'Username', example: 'johndoe', required: false })
  username?: string;

  @ApiProperty({ description: 'First name', example: 'John', required: false })
  firstName?: string;

  @ApiProperty({ description: 'Last name', example: 'Doe', required: false })
  lastName?: string;

  @ApiProperty({ description: 'Is verified', example: false })
  isVerified: boolean;

  @ApiProperty({ description: 'Unread count', example: 5 })
  unreadCount: number;

  @ApiProperty({ description: 'Last message date', example: '2024-01-01T00:00:00Z', required: false })
  lastMessageDate?: string;
}

export class ChatsListResponseDto {
  @ApiProperty({ type: [ChatResponseDto], description: 'List of chats' })
  chats: ChatResponseDto[];

  @ApiProperty({ description: 'Total count', example: 50 })
  total: number;
}
