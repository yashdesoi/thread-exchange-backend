import mongoose, { Schema, Types } from 'mongoose';

export interface CommentInterface {
  content: String;
  author: Types.ObjectId;
  whenCreated: Date;
};

export const commentSchema = new Schema<CommentInterface>({
  content: {
    type: String,
    required: true
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  whenCreated: {
    type: Date,
    default: Date.now
  }
});

export const CommentModel = mongoose.model<CommentInterface>('Comment', commentSchema);
