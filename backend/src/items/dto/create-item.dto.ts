import { IsString, IsInt, IsOptional, IsArray } from 'class-validator';

export class CreateItemDto {
  @IsString()
  name: string;

  @IsString()
  description: string;

  @IsInt()
  categoryId: number;

  @IsOptional()
  @IsArray()
  @IsString({ each: true })
  images?: string[];

  @IsOptional()
  textContent?: Record<string, any>; // Changed from 'content' to 'textContent'
}
