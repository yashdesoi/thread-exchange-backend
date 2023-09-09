import { NextFunction, Request, Response } from "express";
import { GetUserAuthInfoRequestInterface } from "../common-utilities/interfaces";
import { PostModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../common-utilities/utility-classes';
import { Visibility } from '../common-utilities/enums';
import { CreatePostDto } from '../common-utilities/data-transfer-objects';

export const addPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const postData = new CreatePostDto(req.body);
    const post = await PostModel.create({
      ...postData,
      user: loggedInUser?._id
    });
    next(new CustomSuccess(post, 201));
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getAvailablePosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const followings = req.loggedInUser?.following;
    const posts = await PostModel.find({
      $or: [
        { visibility: Visibility.PUBLIC },
        {
          $and: [
            { visibility: Visibility.FOLLOWERS },
            { user: { $in: followings } }
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
        { user: { $in: followings } }
      ]
    })
      .populate('author');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};
