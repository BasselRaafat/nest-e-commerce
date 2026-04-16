import { IsArray, ValidateNested } from 'class-validator';
import { CreateAddressDto } from './create-address.dto';
import { Type } from 'class-transformer';
import { OnlyOneDefault } from 'src/common/decorators/single-default.validator';

export class CreateAddressesDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateAddressDto)
  @OnlyOneDefault()
  addresses: CreateAddressDto[];
}
