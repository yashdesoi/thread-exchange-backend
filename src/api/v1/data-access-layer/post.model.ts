import mongoose, { CallbackWithoutResultAndOptionalError, Schema, Types } from 'mongoose';
import { Visibility } from '../shared';

export interface PostInterface {
  author: Types.ObjectId,
  comments: Array<Types.ObjectId>
  content: string,
  numberOfVotes: number,
  title: string,
  visibility: Visibility,
  whenCreated: Date,
  whenLastUpdated: Date
}

export const postSchema = new Schema<PostInterface>({
  title: {
    type: String,
    required: true,
    trim: true,
    minlength: [5, 'Must be atleast 5 characters']
  },
  content: {
    type: String,
    required: true,
    minlength: [10, 'Must be atleast 10 characters']
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  visibility: {
    type: String,
    enum: [Visibility.PUBLIC, Visibility.FOLLOWERS],
    required: true
  },
  numberOfVotes: {
    type: Number,
    default: 0
  },
  comments: [
    {
      type: Schema.Types.ObjectId,
      ref: 'Comment'
    }
  ],
  whenCreated: {
    type: Date,
    default: Date.now
  },
  whenLastUpdated: {
    type: Date,
    defaut: Date.now
  },
});

postSchema.pre('updateOne', function (next: CallbackWithoutResultAndOptionalError) {
  this.set({ whenLastUpdated: Date.now() });
});

export const PostModel = mongoose.model<PostInterface>('Post', postSchema);
