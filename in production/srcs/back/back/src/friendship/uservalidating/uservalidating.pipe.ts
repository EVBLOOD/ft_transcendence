import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { plainToClass } from 'class-transformer';
import { validate } from 'class-validator';

@Injectable()
export class UservalidatingPipe implements PipeTransform {
  async transform(value: any, {metatype}: ArgumentMetadata) {
    if (!metatype || !this.validateMetaType(metatype)){
        return value;
    }

      const object = plainToClass(metatype, value);
      const errors = await validate(object);

      if(errors.length > 0) {
          throw new BadRequestException('Invalid Input Data')
      }

      return value;

  }

  private validateMetaType(metatype: Function): boolean {
      const types: Function[] = [String, Boolean, Number, Array, Object];
      return !types.includes(metatype)
  }
}
