import mongoose, { Schema, Types } from 'mongoose';
import { VoteDirection } from '../shared';

export interface VoteInterface {
  author: Types.ObjectId;
  post: Types.ObjectId;
  direction: VoteDirection;
};

export const voteSchema = new Schema<VoteInterface>({
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  post: {
    type: Schema.Types.ObjectId,
    ref: 'Post',
    required: true
  },
  direction: {
    type: String,
    required: true,
    enum: [VoteDirection.UP, VoteDirection.DOWN]
  }
});

export const VoteModel = mongoose.model<VoteInterface>('Vote', voteSchema);
