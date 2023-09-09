import { Request } from 'express';
import { UserInterface } from '../../data-access-layer';
import { Types } from 'mongoose';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: (UserInterface & { _id: Types.ObjectId });
};