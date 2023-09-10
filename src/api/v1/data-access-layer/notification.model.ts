import mongoose, { Schema, Types } from 'mongoose';
import { NotificationType } from '../shared';

export interface NotificationInterface {
  type: NotificationType;
  from: Types.ObjectId;
  to: Types.ObjectId;
  post: Types.ObjectId | null;
};

export const notificationSchema = new Schema<NotificationInterface>({
  type: {
    type: String,
    enum: [NotificationType.COMMENT, NotificationType.FOLLOWER, NotificationType.LIKE],
    required: true,
  },
  from: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  to: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
  }
});

export const NotificationModel = mongoose.model('Notification', notificationSchema);
