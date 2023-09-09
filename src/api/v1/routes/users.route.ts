import express from 'express';
import { isAuthenticated } from '../common-utilities/middlewares';
import { addFriend, removeFriend } from '../controllers';

const router = express.Router();

router.post('/:id/friend', isAuthenticated, addFriend);

router.post('/:id/unfriend', isAuthenticated, removeFriend);

export const usersRoute = router;
