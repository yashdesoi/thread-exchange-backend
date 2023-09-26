import { NextFunction, Request, Response } from "express";
import { CreateCommentDto, GetUserAuthInfoRequestInterface, NotificationType, VoteDirection } from "../shared";
import { CommentModel, PostModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../shared';
import { Visibility } from '../shared';
import { CreatePostDto } from '../shared';
import mongoose, { ClientSession } from 'mongoose';
import { VoteInterface, VoteModel } from '../data-access-layer/vote.model';
import { handleNotification } from '../helpers';

export const createPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const post = new PostModel({
      ...(new CreatePostDto(req.body)),
      author: loggedInUser?._id
    });
    await post.save();
    return next(new CustomSuccess(post, 201));
  } catch(error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const getPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const { postId } = req.params;
    const loggedInUserId = loggedInUser?._id.toString();

    const post = await PostModel.findOne({
      $and: [
        { _id: postId },
        {
          $or: [
            { visibility: Visibility.PUBLIC },
            { author: loggedInUserId },
            { author: { $in: loggedInUser?.following } }
          ]
        }
      ],
    })
      .populate('author')
      .populate('comments')
      .populate('votes');

    if (!post) {
      throw new Error(`You do not follow post's author OR post doesn't exist`);
    }

    return next(new CustomSuccess(post, 200));
  } catch (error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const postComment = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();

  try {
    const { loggedInUser } = req;
    const { postId } = req.params;
    const loggedInUserId = loggedInUser?._id.toString();

    const post = await PostModel.findOne({
      $and: [
        { _id: postId },
        {
          $or: [
            { visibility: Visibility.PUBLIC },
            { author: loggedInUserId },
            { author: { $in: loggedInUser?.following } }
          ]
        }
      ],
    });

    if (!post) {
      throw new Error(`You do not follow post's author OR post doesn't exist`);
    }

    const comment = new CommentModel({
      ...(new CreateCommentDto(req.body)),
      author: loggedInUserId,
      post: postId
    });

    post.comments.push(comment._id);

    await post.save({ session });
    await comment.save({ session });

    await handleNotification(
      NotificationType.COMMENT_ON_POST_ADDED,
      <string>loggedInUserId,
      post.author.toString(),
      session,
      postId
    );

    await session.commitTransaction();
    await session.endSession();
    return next (new CustomSuccess(comment, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));
  }
};

export const getComments = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  
};

export const getAvailablePosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const loggedInUserId = req.loggedInUser?._id.toString();
    const following = req.loggedInUser?.following;
    const posts = await PostModel.find({
      $or: [
        { visibility: Visibility.PUBLIC },
        {
          $and: [
            { visibility: Visibility.FOLLOWERS },
            { 
              $or: [
                { author: { $in: following } },
                { author: loggedInUserId }
              ]
            }
          ]
        }
      ]
    })
      .populate('author');
    return next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const getPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.find({ visibility: Visibility.PUBLIC }).populate('author');
    return next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const getFollowingsPosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const following = req.loggedInUser?.following;
    const posts = await PostModel.find({
      $and: [
        { visibility: Visibility.FOLLOWERS },
        { author: { $in: following } }
      ]
    })
      .populate('author');
    return next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    return next(new CustomError(error.message, 400));
  }
};

export const upvotePost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();
    const { postId } = req.params;

    const post = await PostModel.findOne({ 
      $and: [
        { _id: postId },
        {
          $or: [
            { visibility: Visibility.PUBLIC },
            { author: loggedInUserId },
            { author: { $in: loggedInUser?.following } }
          ]
        }
      ]
     });

    if (!post) {
      throw new Error(`You do not follow post's author OR post doesn't exist`);
    }

    let vote = await VoteModel.findOne({
      author: loggedInUserId,
      post: postId
    });

    if (vote && (vote.direction === VoteDirection.UP)) {
      throw new Error(`Your upvote is already present`);
    } else if (vote) {
      vote.direction = VoteDirection.UP;
    } else {
      vote = new VoteModel({
        author: loggedInUserId,
        direction: VoteDirection.UP,
        post: postId
      });
      post.votes.push(vote._id);
    }
    await vote.save({ session });
    await post.save({ session });

    await handleNotification(
      NotificationType.UPVOTE_ON_POST_ADDED,
      <string>loggedInUserId,
      post.author.toString(),
      session,
      postId
    );

    await session.commitTransaction();
    await session.endSession();
    return next (new CustomSuccess(vote, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));

  }
};

export const downvotePost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  const session: ClientSession = await mongoose.startSession();
  session.startTransaction();
  try {
    const { loggedInUser } = req;
    const loggedInUserId = loggedInUser?._id.toString();
    const { postId } = req.params;

    const post = await PostModel.findOne({ 
      $and: [
        { _id: postId },
        {
          $or: [
            { visibility: Visibility.PUBLIC },
            { author: loggedInUserId },
            { author: { $in: loggedInUser?.following } }
          ]
        }
      ]
     });

    if (!post) {
      throw new Error(`You do not follow post's author OR post doesn't exist`);
    }

    let vote = await VoteModel.findOne({
      author: loggedInUserId,
      post: postId
    });

    if (vote && (vote.direction === VoteDirection.DOWN)) {
      throw new Error(`Your downvote is already present`);
    } else if (vote) {
      vote.direction = VoteDirection.DOWN;
    } else {
      vote = new VoteModel({
        author: loggedInUserId,
        direction: VoteDirection.DOWN,
        post: postId
      });
      post.votes.push(vote._id);
    }
    await vote.save({ session });
    await post.save({ session });
    await session.commitTransaction();
    await session.endSession();
    return next (new CustomSuccess(vote, 200));

  } catch (error: any) {
    await session.abortTransaction();
    await session.endSession();
    return next(new CustomError(error.message, 400));

  }
};
