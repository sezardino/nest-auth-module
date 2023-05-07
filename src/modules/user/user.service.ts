import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { FilterQuery, Model } from 'mongoose';
import { HashService } from '../shared/hash.service';
import { PaginationService } from '../shared/pagination.service';
import { CreateUserDto } from './dto/crete-user.dto';
import { FindUsersDto } from './dto/find-users.dto';
import { UpdateUserProfileDto } from './dto/update-profile';
import { User, UserRole } from './user.schema';

@Injectable()
export class UserService {
  constructor(
    @InjectModel(User.name) private readonly userModel: Model<User>,
    private readonly hashService: HashService,
    private readonly paginationService: PaginationService,
  ) {}

  async findOneByEmail(email: string) {
    const user = await this.userModel.findOne({ email }).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findOneById(id: string) {
    const user = await this.userModel.findById(id).exec();

    if (!user) throw new NotFoundException('User not found');

    return user;
  }

  async findMany(
    { role = UserRole.USER, ...dto }: FindUsersDto,
    userRole: UserRole,
  ) {
    if (userRole === UserRole.SUB_ADMIN && role !== UserRole.USER)
      throw new ForbiddenException('You can not get all admins');

    const query: FilterQuery<User> = { role };

    const totalCount = await this.userModel.find(query).countDocuments().exec();
    const { limit, meta, skip } = this.paginationService.getPagination(
      dto.page,
      dto.limit,
      totalCount,
    );

    const data = await this.userModel
      .find(query)
      .sort({ createdAt: -1 })
      .limit(limit)
      .skip(skip)
      .exec();

    return { data, meta };
  }

  async create(dto: CreateUserDto, creatorRole?: UserRole) {
    const { email, password, role = UserRole.USER } = dto;

    if (role === UserRole.ADMIN)
      throw new ForbiddenException('You can not create admin');

    if (role === UserRole.SUB_ADMIN && creatorRole !== UserRole.ADMIN)
      throw new ForbiddenException('You can not create sub admin');

    const isUserExist = await this.userModel.findOne({ email }).exec();

    if (isUserExist) throw new ForbiddenException('User already exist');

    const hashedPassword = await this.hashService.hash(password, 'password');

    const newUser = new this.userModel({
      email,
      password: hashedPassword,
      role,
    });

    return (await newUser.save()).toJSON();
  }

  async deleteById(userId: string, role: UserRole) {
    const user = await this.findOneById(userId);

    if (
      (user.role === UserRole.ADMIN || user.role === UserRole.SUB_ADMIN) &&
      role !== UserRole.ADMIN
    )
      throw new ForbiddenException('You can not delete this user');

    return this.userModel.findByIdAndDelete(userId).exec();
  }

  async updateUserToken(email: string, token: string) {
    const newToken = token ? await this.hashService.hash(token, 'token') : '';

    return this.userModel
      .findOneAndUpdate({ email }, { token: newToken })
      .exec();
  }

  async updateProfile(email: string, dto: UpdateUserProfileDto) {
    const user = await this.findOneById(email);

    const dataToUpdate = {};

    if (dto.name) dataToUpdate['name'] = dto.name;
    if (dto.address) dataToUpdate['address'] = dto.address;
    if (dto.surname) dataToUpdate['surname'] = dto.surname;

    await user.updateOne({ $set: dataToUpdate });

    return await user.save();
  }
}
