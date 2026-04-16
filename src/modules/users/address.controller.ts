import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  ParseIntPipe,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { CurrentUser } from 'src/common/decorators/current-user.decorator';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressesDto } from './dto/create-addresses.dto';
import { AddressService } from './address.service';
import { JwtAuthGuard } from 'src/common/guards/jwt-auth.guard';

@Controller('address')
@UseGuards(JwtAuthGuard)
export class AddressController {
  constructor(private readonly addressService: AddressService) {}

  @Post()
  async addAddresses(
    @Body()
    createAddressDto: CreateAddressesDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return await this.addressService.addAddresses(createAddressDto, user);
  }

  @Get()
  async findUserAddress(@CurrentUser() user: JwtPayload) {
    return this.addressService.findUserAddress(user);
  }

  @Patch(':id')
  update(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateAddressDto: UpdateAddressDto,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.addressService.update(id, updateAddressDto, user);
  }

  @Delete(':id')
  delete(
    @Param('id', ParseIntPipe) id: number,
    @CurrentUser() user: JwtPayload,
  ) {
    return this.addressService.delete(id, user);
  }
}
