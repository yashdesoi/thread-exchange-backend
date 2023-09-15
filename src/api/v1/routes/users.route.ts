import express from 'express';
import { isAuthenticated } from '../shared';
import { followUser, unfollowUser } from '../controllers';

const router = express.Router();

router.post('/:userId/follow', isAuthenticated, followUser);

router.post('/:userId/unfollow', isAuthenticated, unfollowUser);

export const usersRoute = router;
