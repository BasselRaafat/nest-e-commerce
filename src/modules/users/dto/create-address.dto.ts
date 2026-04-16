import { IsBoolean, IsNumberString, IsString } from 'class-validator';

export class CreateAddressDto {
  @IsString()
  city: string;
  @IsString()
  street: string;
  @IsNumberString()
  postalCode: string;
  @IsString()
  country: string;

  @IsString()
  building: string;
  @IsBoolean()
  isDefault: boolean;
}
