import { NextFunction, Response } from 'express';
import { GetUserAuthInfoRequestInterface } from '../shared';
import { UserModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../shared';
import { isInFollowingList } from '../helpers';
import { Types } from 'mongoose';

export const followUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();

    if (loggedInUserId === userId) {
      throw new Error(`Cannot follow self`);
    }

    if (isInFollowingList(userId, <Array<Types.ObjectId>>loggedInUser?.following)) {
      throw new Error(`Already following`);
    }


    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { followers: loggedInUserId } },
      { new: true }
    );

    if (!user) {
      throw new Error('Invalid id in params');
    }

    await UserModel.findOneAndUpdate(
      { _id: loggedInUserId },
      { $push: { following: userId } },
    );
    return next(new CustomSuccess(`Started following ${user?.name}`, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const unfollowUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { userId } = req.params;
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();

    if (loggedInUserId === userId) {
      throw new Error(`Cannot unfollow self`);
    }

    if (!isInFollowingList(userId, <Array<Types.ObjectId>>loggedInUser?.following)) {
      throw new Error(`Already unfollowing`);
    }

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $pull: { followers: loggedInUserId } },
    );

    if (!user) {
      throw new Error('Invalid id in params');
    }

    await UserModel.findOneAndUpdate(
      { _id: loggedInUserId },
      { $pull: { following: userId } },
    );
    return next(new CustomSuccess(`Unfollowed ${user?.name}`, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};
