import { IsString, IsNotEmpty, IsObject, IsOptional, IsInt } from 'class-validator';

export class CreateItemDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsString()
  @IsNotEmpty()
  description: string;

  @IsInt()
  @IsNotEmpty()
  categoryId: number;

  @IsString()
  @IsOptional()
  image?: string;

  @IsObject()
  @IsNotEmpty()
  content: any;
}