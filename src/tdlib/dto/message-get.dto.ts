import { IsString, IsNumber, IsOptional } from 'class-validator';

export class GetMessageDto {
  @IsString()
  clientId: string;

  @IsString()
  chatId: string;

  @IsNumber()
  messageId: number;
}
