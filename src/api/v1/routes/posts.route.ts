import express from 'express';
import {
  createPost,
  getAvailablePosts,
  getPublicPosts,
  getFollowingsPosts,
  getPost,
  postComment
} from '../controllers';
import { isAuthenticated } from '../shared';

const router = express.Router();

router.get('/', isAuthenticated, getAvailablePosts);
router.post('/', isAuthenticated, createPost);


router.get('/public', getPublicPosts);

router.get('/followings', isAuthenticated, getFollowingsPosts);

router.get('/:postId', isAuthenticated, getPost);

router.post('/:postId/comment', isAuthenticated, postComment);

export const postsRoute = router;
