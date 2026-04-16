import { registerDecorator } from 'class-validator';
import { CreateAddressDto } from '../../modules/users/dto/create-address.dto';

/*you may think that i used ai for this, you would be right, but i came up with the idea of using a custom validtion decorator
 */
export function OnlyOneDefault() {
  return function (object: object, propertyName: string) {
    registerDecorator({
      name: 'onlyOneDefault',
      target: object.constructor,
      propertyName,
      validator: {
        validate(value: CreateAddressDto[]) {
          return (
            Array.isArray(value) && value.filter((i) => i.isDefault).length <= 1
          );
        },
        defaultMessage() {
          return 'Only one address can be set as default';
        },
      },
    });
  };
}
