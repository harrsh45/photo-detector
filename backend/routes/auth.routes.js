import express from 'express';
import { googleAuthController, googleAuthCallbackController } from '../controllers/auth.controller.js';

const router = express.Router();

// Google OAuth routes
router.get('/google', googleAuthController);
router.get('/google/callback', googleAuthCallbackController);

export default router;