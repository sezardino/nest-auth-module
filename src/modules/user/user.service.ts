import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { HashService } from '../shared/hash.service';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashService: HashService,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(email: string, password: string) {
    const isUserExist = this.userModel.findOne({ email }).exec();

    if (isUserExist) throw new ForbiddenException('User already exist');

    const hashedPassword = await this.hashService.hash(password, 'password');

    const newUser = new this.userModel({ email, password: hashedPassword });

    return (await newUser.save()).toJSON();
  }

  async updateUserToken(email: string, token: string) {
    const newToken = token ? await this.hashService.hash(token, 'token') : '';

    return this.userModel
      .findOneAndUpdate({ email }, { token: newToken })
      .exec();
  }
}
