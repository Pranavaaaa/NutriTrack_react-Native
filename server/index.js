import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();
import app from './app.js';
import cookieParser from 'cookie-parser';
import connectDB from './db/db.js';
import bodyParser from 'body-parser';
import userRoutes from './routes/user.routes.js';



const port = process.env.PORT || 4001;

app.use(cors());
app.use(bodyParser.json());  // to support JSON-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ urlencoded : true }));
app.use(cookieParser());

connectDB();

app.get('/', (req, res) => {
  res.send('Hello From Server!');
});

app.use('/users', userRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});