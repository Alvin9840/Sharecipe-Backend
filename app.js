const express = require('express');
require('dotenv').config()
const { default: mongoose } = require('mongoose');
var cors = require('cors')
const app = express();
const port = process.env.PORT || 8000;


// Middleware to parse JSON requests
app.use(express.json(), cors());

const uri = process.env.MONGODB_URL; // Replace with your MongoDB URI and database name

async function startServer() {
  if (!uri) {
    throw new Error('MONGODB_URL is missing in backend/.env');
  }

  try {
    await mongoose.connect(uri);
    console.log("Connected to MongoDB");

    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  } catch (error) {
    console.error('Failed to connect to MongoDB:', error.message);
    process.exit(1);
  }
}


// Example route
app.get('/', (req, res) => {
  res.send('Hello, this is your Express app!');
});


//User Route
const userRoute = require('./routes/userRoute');
app.use('/user', userRoute, cors());

//Post Route
const postRoute = require('./routes/postRoute');
app.use('/post', postRoute, cors());

//Comment Route
const commentRoute = require('./routes/commentRoute');
app.use('/comment', commentRoute, cors());


startServer();
