import { Types } from 'mongoose';

export const isInFollowingList = (userId: String, following: Array<Types.ObjectId>): boolean => {
  let isNotInFollowingList = true;
  for (const followeeId of following) {
    if (followeeId.toString() === userId) {
      isNotInFollowingList = false;
      break;
    }
  }
  return !isNotInFollowingList;
};

export const isInFollowersList = (userId: String, followers: Array<Types.ObjectId>): boolean => {
  let isNotInFollowerList = true;
  for (const followerId of followers) {
    if (followerId.toString() === userId) {
      isNotInFollowerList = false;
      break;
    }
  }
  return !isNotInFollowerList;
};