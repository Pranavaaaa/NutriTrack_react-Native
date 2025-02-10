const dotenv = require('dotenv');
const express = require('express');
const app = express();
const cors = require('cors');
const cookieParser = require('cookie-parser');
const connectDB = require('./db/db.js'); 
dotenv.config();
const bodyParser = require('body-parser');
const userRoutes = require('./routes/user.routes.js');

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