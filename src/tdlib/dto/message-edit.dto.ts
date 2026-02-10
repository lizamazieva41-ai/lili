import { IsString, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class EditMessageTextDto {
  @IsString()
  clientId: string;

  @IsString()
  chatId: string;

  @IsNumber()
  messageId: number;

  @IsString()
  text: string;

  @IsOptional()
  @IsBoolean()
  disableWebPagePreview?: boolean;
}
