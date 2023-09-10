import express from 'express';
import { isAuthenticated } from '../shared';
import { followUser, unfollowUser } from '../controllers';

const router = express.Router();

router.post('/:id/follow', isAuthenticated, followUser);

router.post('/:id/unfollow', isAuthenticated, unfollowUser);

export const usersRoute = router;
