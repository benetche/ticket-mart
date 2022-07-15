import mongoose, { Document, model, Model, Schema } from 'mongoose';
import mongooseUniqueValidator from 'mongoose-unique-validator';
import bcrypt from 'bcrypt';
import { ITicket } from './Ticket';
const SALT_WORK_FACTOR = 10;

export type UserType = 'admin' | 'user';

export interface IUser extends Document {
  _id: mongoose.Types.ObjectId;
  email: string;
  name: string;
  password: string;
  phone?: string;
  type: UserType;
  tickets?: ITicket[] | mongoose.Types.ObjectId[];
  validatePassword(candidatePassword: string): Promise<boolean>;
}

const UserSchema: Schema = new Schema({
  email: {
    type: String,
    required: [true, 'Insira um e-mail!'],
    unique: true,
    uniqueCaseInsensitive: true,
    validate: {
      validator: (email: string) => {
        return /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/.test(
          email
        );
      },
      message: (props: any) => `${props.value} não é um e-mail válido!`,
    },
  },
  name: {
    type: String,
    required: [true, 'Insira um nome!'],
    minlength: [3, 'O nome deve ter no mínimo 3 caracteres!'],
  },
  password: {
    type: String,
    required: [true, 'Insira uma senha!'],
    minlength: [8, 'A senha deve ter no mínimo 8 caracteres!'],
    maxLength: [72, 'A senha deve ter no máximo 72 caracteres!'],
    select: false,
  },
  type: {
    type: String,
    enum: ['user', 'admin'],
    default: 'user',
    required: true,
  },
  phone: {
    type: String,
  },
  tickets: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Ticket',
      select: false,
    },
  ],
});

UserSchema.pre('save', async function (next) {
  const user = this as IUser;

  if (!user.isModified('password')) {
    return next();
  }

  try {
    const salt = await bcrypt.genSalt(SALT_WORK_FACTOR);
    const hash = await bcrypt.hash(user.password, salt);
    user.password = hash;
    return next();
  } catch (err) {
    return next(err as Error);
  }
});

UserSchema.methods.validatePassword = async function (
  candidatePassword: string
): Promise<boolean> {
  const user = this as IUser;
  const isMatch = await bcrypt.compare(candidatePassword, user.password);
  return isMatch;
};

UserSchema.plugin(mongooseUniqueValidator, {
  message: 'O e-mail {VALUE} já está em uso!',
});

export const User: Model<IUser> =
  mongoose.models.User || model('User', UserSchema);
