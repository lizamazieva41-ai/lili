import { IsString, IsArray, IsNumber, IsOptional, IsBoolean } from 'class-validator';

export class DeleteMessagesDto {
  @IsString()
  clientId: string;

  @IsString()
  chatId: string;

  @IsArray()
  @IsNumber({}, { each: true })
  messageIds: number[];

  @IsOptional()
  @IsBoolean()
  revoke?: boolean;
}
