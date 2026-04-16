import {
  ConflictException,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Address } from './entities/address.entity';
import { Repository } from 'typeorm';
import type { JwtPayload } from 'src/common/types/jwt-payload.type';
import { UpdateAddressDto } from './dto/update-address.dto';
import { CreateAddressesDto } from './dto/create-addresses.dto';

@Injectable()
export class AddressService {
  constructor(
    @InjectRepository(Address)
    private readonly addressRepo: Repository<Address>,
  ) {}
  async addAddresses(createAddressDto: CreateAddressesDto, user: JwtPayload) {
    const existingDefaults = await this.addressRepo.find({
      where: { userId: user.sub, isDefault: true },
    });
    const incomingDefaults = createAddressDto.addresses.filter(
      (add) => add.isDefault,
    );

    if (existingDefaults.length > 0 && incomingDefaults.length === 1)
      throw new ConflictException('A default address already exists');

    const addresses = this.addressRepo.create(
      createAddressDto.addresses.map((add) => ({ ...add, userId: user.sub })),
    );
    const createdAddress = await this.addressRepo.save(addresses);
    return createdAddress;
  }
  async findUserAddress(user: JwtPayload) {
    const address = await this.addressRepo.find({
      where: { userId: user.sub },
    });
    return address;
  }

  async update(id: number, updateAddress: UpdateAddressDto, user: JwtPayload) {
    const address = await this.addressRepo.findOne({
      where: { id, userId: user.sub },
    });
    if (!address) throw new NotFoundException('Address not found');

    if (updateAddress.isDefault === true && !address.isDefault) {
      const existingDefault = await this.addressRepo.findOne({
        where: { userId: user.sub, isDefault: true },
      });

      if (existingDefault)
        throw new ConflictException('A default address already exists');
    }

    Object.assign(address, updateAddress);

    return await this.addressRepo.save(address);
  }

  async delete(id: number, user: JwtPayload) {
    const address = await this.addressRepo.findOne({ where: { id } });
    if (!address) throw new NotFoundException('Address not found');
    if (address.userId != user.sub)
      throw new UnauthorizedException(
        'You are not authorized to delete this address',
      );
    const deletedAddress = await this.addressRepo.delete(id);
    return deletedAddress;
  }
}
