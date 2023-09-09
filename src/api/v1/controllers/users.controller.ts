import { NextFunction, Response } from 'express';
import { GetUserAuthInfoRequestInterface } from '../common-utilities/interfaces';
import { UserModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../common-utilities/utility-classes';

export const followUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const userId = req.params.id;
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();

    if (loggedInUserId === userId) {
      throw new Error(`Cannot follow self`);
    }

    loggedInUser?.following.forEach(user => {
      if (user._id.toString() === userId) {
        throw new Error(`Already following`);
      }
    });

    const user = await UserModel.findOneAndUpdate(
      { _id: userId },
      { $push: { followers: loggedInUserId } },
    );

    await UserModel.findOneAndUpdate(
      { _id: loggedInUserId },
      { $push: { following: userId } },
    );
    next(new CustomSuccess(`Started following ${user?.name}`, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const unfollowUser = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    try {
      const userId = req.params.id;
      const { loggedInUser } = req;
      const loggedInUserId = loggedInUser?._id.toString();
  
      if (loggedInUserId === userId) {
        throw new Error(`Cannot unfollow self`);
      }
  
      let isNotFollowing = true;
      for (let user of <Array<any>>loggedInUser?.following) {
        if (user._id.toString() === userId) {
          isNotFollowing = false;
          break;
        }
      }
      if (isNotFollowing) {
        throw new Error(`Already unfollowing`);
      }
  
      const user = await UserModel.findOneAndUpdate(
        { _id: userId },
        { $pull: { followers: loggedInUserId } },
      );
  
      await UserModel.findOneAndUpdate(
        { _id: loggedInUserId },
        { $pull: { following: userId } },
      );
      next(new CustomSuccess(`Unfollowed ${user?.name}`, 200));
    } catch (error: any) {
      next(new CustomError(error.message, 400));
    }
  } catch (error: any) {
    
  }
};
