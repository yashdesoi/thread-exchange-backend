import mongoose, { Schema, Types } from 'mongoose';
import { NotificationType } from '../shared';

export interface NotificationInterface {
  type: NotificationType;
  from: Types.ObjectId;
  to: Types.ObjectId;
  post?: Types.ObjectId;
  whenCreated: Date
};

export const notificationSchema = new Schema<NotificationInterface>({
  type: {
    type: String,
    enum: [NotificationType.COMMENT_ON_POST_ADDED, NotificationType.FOLLOWER_ADDED, NotificationType.UPVOTE_ON_POST_ADDED],
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
  },
  whenCreated: {
    type: Date,
    default: Date.now
  }
});

export const NotificationModel = mongoose.model('Notification', notificationSchema);
