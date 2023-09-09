import express from 'express';
import { addPost, getAvailablePosts, getPublicPosts, getFollowingsPosts } from '../controllers';
import { isAuthenticated } from '../common-utilities/middlewares';

const router = express.Router();

router.get('/', isAuthenticated, getAvailablePosts);
router.post('/', isAuthenticated, addPost)

router.get('/public', getPublicPosts);

router.get('/followings', isAuthenticated, getFollowingsPosts);

export const postsRoute = router;
