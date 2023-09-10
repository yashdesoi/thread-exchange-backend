import { NextFunction, Request, Response } from "express";
import { GetUserAuthInfoRequestInterface } from "../shared";
import { PostModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../shared';
import { Visibility } from '../shared';
import { CreatePostDto } from '../shared';
import { isInFollowingList } from '../helpers';
import { Types } from 'mongoose';

export const createPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const postData = new CreatePostDto(req.body);
    const post = await PostModel.create({
      ...postData,
      author: loggedInUser?._id
    });
    next(new CustomSuccess(post, 201));
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const postId = req.params.id;
    const loggedInUserId = loggedInUser?._id.toString();
    const post  = await PostModel.findOne({ _id: postId }).populate('author');
    const authorId = post?.author._id.toString();

    if (post?.visibility === Visibility.PUBLIC) {
      next(new CustomSuccess(post, 200));
    }

    if (!(authorId === loggedInUserId) &&
        !isInFollowingList(<string>authorId, <Array<Types.ObjectId>>loggedInUser?.following)) {
      throw new Error(`You do not follow post's author`);
    }

    next(new CustomSuccess(post, 200));

  } catch (error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getAvailablePosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const loggedInUserId = req.loggedInUser?._id.toString();
    const followings = req.loggedInUser?.following;
    const posts = await PostModel.find({
      $or: [
        { visibility: Visibility.PUBLIC },
        {
          $and: [
            { visibility: Visibility.FOLLOWERS },
            { 
              $or: [
                { author: { $in: followings } },
                { author: loggedInUserId }
              ]
            }
          ]
        }
      ]
    })
      .populate('author');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostModel.find({ visibility: Visibility.PUBLIC }).populate('author');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getFollowingsPosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const followings = req.loggedInUser?.following;
    const posts = await PostModel.find({
      $and: [
        { visibility: Visibility.FOLLOWERS },
        { author: { $in: followings } }
      ]
    })
      .populate('author');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};
