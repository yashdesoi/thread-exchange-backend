import { ClientSession } from 'mongoose';
import { NotificationType } from '../shared';
import { NotificationModel } from '../data-access-layer';

export const handleNotification = async (type: NotificationType,
                                         from: string,
                                         to: string,
                                         session: ClientSession,
                                         post?: string): Promise<void> => {
  if (type === NotificationType.FOLLOWER_ADDED) {
    const notification = new NotificationModel({
      type,
      from,
      to,
    });
    await notification.save({ session });
  } else {
    const notification = new NotificationModel({
      type,
      from,
      to,
      post
    });
    await notification.save({ session });
  }
};