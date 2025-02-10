const express = require('express');
const { body } = require('express-validator');
const userModel = require('../models/user.model');
const router = express.Router();
const userController = require('../controllers/user.controller');
const authMiddlewares = require('../middlewares/auth.middleware');

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