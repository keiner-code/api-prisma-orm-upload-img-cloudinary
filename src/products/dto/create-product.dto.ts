import {
  IsBoolean,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsPositive,
  IsString,
  Min,
  MinLength,
} from 'class-validator';

export class CreateProductDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public title: string;

  @IsString()
  @IsNotEmpty()
  @MinLength(7)
  public description: string;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(10)
  public price: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  @Min(10)
  public oldPrice: number;

  @IsBoolean()
  @IsOptional()
  public available: boolean;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public amount: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public imagesId: number;

  @IsNumber()
  @IsNotEmpty()
  @IsPositive()
  public categoryId: number;
}
