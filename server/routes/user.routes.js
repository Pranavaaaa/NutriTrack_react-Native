import express from 'express';
import { body } from 'express-validator';
import userController from '../controllers/user.controller';
import authMiddlewares from '../middlewares/auth.middleware';
import userModel from '../models/user.model';
import router from './user.routes';

router.post("/register", [
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
    body('fullname.firstname').isLength({ min: 2 }).withMessage('First name must be at least 2 characters long'),
], 
userController.registerUser);

router.get("/login",[
    body('email').isEmail().withMessage('Invalid email'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters long'),
], 
userController.loginUser);

router.get('/profile', authMiddlewares.authUser, userController.getUserProfile);

module.exports = router;