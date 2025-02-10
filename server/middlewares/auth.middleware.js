import userModel from '../models/user.model.js';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt';

module.exports.authUser = async (req, res, next) => {

   const token = req.cookie.token || req.header.authorization.split(' ')[1];

   if(!token){
      return res.status(401).json({ message : 'Unauthorized' });
   }

   try{
      const decoded = jwt.verify(token, process.env.JWT_SECRET);
      const user = await userModel.findById(decoded._id);

      req.user = user;

      return next();

   }
   catch(error){
      res.status(401).json({ message : 'Unauthorized' });
   }

}