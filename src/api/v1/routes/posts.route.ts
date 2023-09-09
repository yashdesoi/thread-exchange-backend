import express from 'express';
import { addPost, getAvailablePosts, getFriendsPosts, getPublicPosts } from '../controllers';
import { isAuthenticated } from '../common-utilities/middlewares';

const router = express.Router();

router.get('/', isAuthenticated, getAvailablePosts);
router.post('/', isAuthenticated, addPost)

router.get('/public', getPublicPosts);

router.get('/friends', isAuthenticated, getFriendsPosts);

export const postsRoute = router;
