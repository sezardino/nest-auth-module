import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { User } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async create(email: string, password: string) {
    const newUser = new this.userModel({ email, password });

    return (await newUser.save()).toJSON();
  }

  async updateUserToken(email: string, token: string) {
    return this.userModel.findOneAndUpdate({ email }, { token }).exec();
  }
}
