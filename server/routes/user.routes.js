import express from "express";
import { body } from "express-validator";
import { registerUser, loginUser, getUserProfile } from "../controllers/user.controller.js"; // ✅ Correct Import
import  authUser  from "../middlewares/auth.middleware.js"; // ✅ Correct Import

const router = express.Router(); // ✅ Define router before using it

router.post(
  "/register",
  [
    body("username")
      .isLength({ min: 2 })
      .withMessage("Username must be at least 2 characters long"),
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 4 })
      .withMessage("Password must be at least 6 characters long"),
    body("physicalDetails.age").isNumeric().withMessage("Age must be a number"),
    body("physicalDetails.weight")
      .isNumeric()
      .withMessage("Weight must be a number"),
    body("physicalDetails.height")
      .isNumeric()
      .withMessage("Height must be a number"),
  ],
  registerUser // ✅ Use imported function directly
);

router.post( // ✅ Change GET to POST for login
  "/login",
  [
    body("email").isEmail().withMessage("Invalid email"),
    body("password")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters long"),
  ],
  loginUser
);

router.get("/profile", authUser, getUserProfile); // ✅ Use imported function directly

export default router;
