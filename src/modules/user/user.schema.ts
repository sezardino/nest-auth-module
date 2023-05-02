import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { ApiProperty } from '@nestjs/swagger';
import { HydratedDocument } from 'mongoose';

export enum UserRole {
  ADMIN = 'admin',
  SUB_ADMIN = 'sub_admin',
  USER = 'user',
}

@Schema({ timestamps: true })
export class User {
  @Prop({ required: true, type: String })
  @ApiProperty({ example: 'test@mail.com', description: 'email of the user' })
  email: string;

  @Prop({ required: true, type: String })
  @ApiProperty({ example: 'password1', description: 'password of the user' })
  password: string;

  @Prop({ required: true, enum: UserRole, default: UserRole.USER })
  @ApiProperty({ example: UserRole.ADMIN, description: 'role of the user' })
  role: UserRole;

  @Prop({ required: false, default: '' })
  @ApiProperty({
    example: 'hashed token',
    description: 'refresh token of the user',
    default: '',
  })
  token: string;
}

export type UserDocument = HydratedDocument<User>;
export const UserSchema = SchemaFactory.createForClass(User);

UserSchema.set('toJSON', {
  transform: (doc, ret) => {
    ret.id = ret._id;

    delete ret['_id'];
    delete ret['password'];
    delete ret['token'];
    return ret;
  },
});
