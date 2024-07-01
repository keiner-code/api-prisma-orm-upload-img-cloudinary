import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateCategoryDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public name: string;
  @IsNotEmpty()
  @IsString()
  @MinLength(4)
  public image: string;
}
