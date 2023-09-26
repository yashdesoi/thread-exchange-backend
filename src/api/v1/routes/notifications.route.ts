import express from 'express';
import { isAuthenticated } from '../shared';
import { getNotifications, deleteNotifications } from '../controllers';

const router = express.Router();

router.get('/', isAuthenticated, getNotifications);

router.delete('/', isAuthenticated, deleteNotifications);

export const notificationsRoute = router;
