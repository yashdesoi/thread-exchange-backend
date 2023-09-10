import express from 'express';
import {
  createPost,
  getAvailablePosts,
  getPublicPosts,
  getFollowingsPosts,
  getPost
} from '../controllers';
import { isAuthenticated } from '../shared';

const router = express.Router();

router.get('/', isAuthenticated, getAvailablePosts);
router.post('/', isAuthenticated, createPost);


router.get('/public', getPublicPosts);

router.get('/followings', isAuthenticated, getFollowingsPosts);

router.get('/:id', isAuthenticated, getPost);

export const postsRoute = router;
