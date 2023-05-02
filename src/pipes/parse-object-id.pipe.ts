import { BadRequestException, Injectable, PipeTransform } from '@nestjs/common';
import { Types } from 'mongoose';

export const SafeMongoIdTransform = ({ value }) => {
  try {
    if (
      Types.ObjectId.isValid(value) &&
      new Types.ObjectId(value).toString() === value
    ) {
      return value;
    }
    throw new BadRequestException('Id validation fail');
  } catch (error) {
    throw new BadRequestException('Id validation fail');
  }
};

@Injectable()
export class ParseObjectIdPipe implements PipeTransform<any, Types.ObjectId> {
  transform(value: any): Types.ObjectId {
    try {
      if (
        Types.ObjectId.isValid(value) &&
        new Types.ObjectId(value).toString() === value
      ) {
        return value;
      }
      throw new BadRequestException('Id validation fail');
    } catch (error) {
      throw new BadRequestException('Id validation fail');
    }
  }
}
