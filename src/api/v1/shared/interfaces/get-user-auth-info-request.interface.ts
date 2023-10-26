import { Request } from 'express';
import { UserInterface } from '../../data-access-layer';
import { Document, Types } from 'mongoose';

export interface GetUserAuthInfoRequestInterface extends Request {
  loggedInUser?: (Document & UserInterface & { _id: Types.ObjectId });
};