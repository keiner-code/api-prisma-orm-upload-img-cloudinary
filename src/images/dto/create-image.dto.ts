import { IsNotEmpty, IsString } from 'class-validator';

export class CreateImageDto {
  @IsString()
  @IsNotEmpty()
  public image_one: string;
  @IsString()
  @IsNotEmpty()
  public image_two: string;
  @IsString()
  @IsNotEmpty()
  public image_three: string;
  @IsString()
  @IsNotEmpty()
  public image_four: string;
}
