import { Request } from 'express';
import { UserDataInterface } from '../../data-access-layer';
import { Types } from 'mongoose';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: (UserDataInterface & { _id: Types.ObjectId });
};