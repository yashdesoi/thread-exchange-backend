import { NextFunction, Request, Response } from 'express';
import { UserModel } from '../data-access-layer';
import { getAccessToken, isPasswordValid } from '../helpers';
import { CustomError, CustomSuccess } from '../shared';
import { AuthCredentialsDto } from '../shared';

export const signUp = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const user = new UserModel({
      ...(new AuthCredentialsDto(req.body))
    });
    await user.save();
    return next(new CustomSuccess(user, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const signIn = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { email, password } = req.body;
    const user = await UserModel.findOne({ email });
    if (!email) {
      throw new Error('Email is required');
    }
    if (!user || !(await isPasswordValid(password, user.password))) {
      throw new Error('Incorrect email or password');
    }
    const accessToken = getAccessToken({
      mongoDbUserId: user._id.toString()
    });
    return next(new CustomSuccess({ accessToken }, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 401));
  }
};
