import { IsNotEmpty, IsOptional, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public name: string;
  @IsOptional()
  @IsString()
  @MinLength(4)
  public image: string;
}
