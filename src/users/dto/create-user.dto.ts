import {
  IsEmail,
  IsNotEmpty,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public name: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(4)
  public lastName: string;
  @IsEmail()
  @IsNotEmpty()
  public email: string;
  @IsString()
  @IsNotEmpty()
  public role: string;
  @IsString()
  @IsNotEmpty()
  @MinLength(8)
  public password: string;
  @IsString()
  @IsOptional()
  public photo: string;
}
