import { NextFunction, Request, Response } from "express";
import { GetUserAuthInfoRequestInterface } from "../common-utilities/interfaces";
import { PostDataModel } from '../data-access-layer';
import { CustomError, CustomSuccess } from '../common-utilities/utility-classes';
import { Visibility } from '../common-utilities/enums';
import { CreatePostDto } from '../common-utilities/data-transfer-objects/create-post.dto';

export const addPost = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const { loggedInUser } = req;
    const postData = new CreatePostDto(req.body);
    const post = await PostDataModel.create({
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
    const friends = req.loggedInUser?.friends;
    const posts = await PostDataModel.find({
      $or: [
        { visibility: Visibility.public },
        {
          $and: [
            { visibility: Visibility.friends },
            { user: { $in: friends } }
          ]
        }
      ]
    })
      .populate('user');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getPublicPosts = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const posts = await PostDataModel.find({ visibility: Visibility.public }).populate('user');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};

export const getFriendsPosts = async (req: GetUserAuthInfoRequestInterface, res: Response, next: NextFunction) => {
  try {
    const friends = req.loggedInUser?.friends;
    const posts = await PostDataModel.find({
      $and: [
        { visibility: Visibility.friends },
        { user: { $in: friends } }
      ]
    })
      .populate('user');
    next(new CustomSuccess(posts, 200))
  } catch(error: any) {
    next(new CustomError(error.message, 400));
  }
};
