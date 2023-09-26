import { NextFunction, Response } from 'express';
import { CustomError, CustomSuccess, GetUserAuthInfoRequestInterface } from '../shared';
import { NotificationModel } from '../data-access-layer';

export const getNotifications = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();
    const notifications = await NotificationModel
      .find({ to: loggedInUserId })
      .populate('from')
      .populate('post');
    return next(new CustomSuccess(notifications, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};

export const deleteNotifications = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();
    const notifications = await NotificationModel.deleteMany({ to: loggedInUserId });
    return next(new CustomSuccess(notifications, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 500));
  }
};
