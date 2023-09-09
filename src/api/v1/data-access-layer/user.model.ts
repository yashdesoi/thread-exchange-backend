import mongoose, { CallbackWithoutResultAndOptionalError, Schema, Types } from 'mongoose';
import { getHashedPassword } from '../helpers';
import { EMAIL_REGEX, PASSWORD_REGEX } from '../common-utilities/constants';

export interface UserInterface {
  email: string,
  password: string,
  followers: Array<Types.ObjectId>,
  following: Array<Types.ObjectId>,
  name: string
}

export const userSchema = new Schema<UserInterface>({
  email: {
    type: String,
    required: true,
    unique: true,
    trim: true,
    match: [EMAIL_REGEX, 'Invalid email'],
  },
  followers: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  following: [
    {
      type: Schema.Types.ObjectId,
      ref: 'User',
    }
  ],
  password: {
    type: String,
    required: true,
  },
  name: {
    type: String,
    required: true
  }
});

userSchema.pre('save', async function (next: CallbackWithoutResultAndOptionalError) {
  if (!this.isModified('password')) {
    next();
  }

  if (!PASSWORD_REGEX.test(this.password)) {
    next(new Error(`Invalid password`));
  }

  try {
    this.password = await getHashedPassword(this.password);
    next();
  } catch (error: any) {
    next(error);
  }
});

export const UserModel = mongoose.model<UserInterface>('User', userSchema);
