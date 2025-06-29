import {Router} from 'express'
import * as userController from '../controllers/user.controller.js'
import {body} from 'express-validator'
import * as authMiddleware from '../middleware/auth.middleware.js'
const router =Router()

router.post('/register',
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.createUserController);

router.post('/login',
    body('username').isLength({ min: 3 }).withMessage('Username must be at least 3 characters long'),
    body('password').isLength({ min: 3 }).withMessage('Password must be at least 3 characters long'),
    userController.loginController);

router.get('/logout', authMiddleware.authUser, userController.logoutController);

// Get current user route
router.get('/me', authMiddleware.authUser, userController.getCurrentUserController);

export default router;