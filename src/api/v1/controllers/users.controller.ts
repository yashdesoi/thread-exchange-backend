import { NextFunction, Response } from 'express';
import { GetUserAuthInfoRequestInterface } from '../common-utilities/interfaces';
import { UserDataModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../common-utilities/utility-classes';

export const addFriend = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const friendId = req.params.id;
    const { loggedInUser } = req;
    if (loggedInUser?._id.toString() === friendId) {
      throw new Error(`Cannot friend self`);
    }

    loggedInUser?.friends.forEach(friend => {
      if (friend._id.toString() === friendId) {
        throw new Error(`Already friend`);
      }
    });

    const change = await UserDataModel.findOneAndUpdate(
      { _id: loggedInUser?._id.toString() },
      { $push: { friends: friendId } },
      { new: true }
    );
    next(new CustomSuccess(change, 200));
  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const removeFriend = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    
  } catch (error: any) {
    
  }
};
