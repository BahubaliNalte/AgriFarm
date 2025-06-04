const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const path = require('path');
require('dotenv').config();

const app = express();

// Set Mongoose `strictQuery` option globally before connecting to MongoDB
mongoose.set('strictQuery', false);

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
}).then(() => console.log('MongoDB connected'))
  .catch(err => {
    console.error('MongoDB connection error:', err);
    process.exit(1);  // Exit the process if MongoDB connection fails
  });

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(cookieParser());
app.use('/uploads', express.static('uploads'));

// Set view engine
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Routes
app.get("/privacy", (req, res) => {
  res.render("privacy"); 
});
app.get("/terms", (req, res) => {
  res.render("terms"); 
});
app.get("/contact", (req, res) => {
  res.render("contact"); 
});

app.use('/', require('./routes/index'));
app.use('/auth', require('./routes/auth'));
app.use('/farmer', require('./routes/farmer'));
app.use('/farm', require('./routes/farm'));
app.use('/api/products', require('./routes/store'));
app.use('/api/orders', require('./routes/orders'));
app.use('/store', require('./routes/storePage'));
app.use('/api/lease', require('./routes/lease'));
app.use('/api/hire', require('./routes/hire'));
app.use('/api/feedback', require('./routes/feedback'));

// Port handling: checking if port is in use
const PORT = process.env.PORT || 5000;
app.listen(PORT, (err) => {
  if (err) {
    console.error(`Error: Port ${PORT} is already in use.`);
    process.exit(1); // Exit if the port is already in use
  }
  console.log(`Server running on port ${PORT}`);
});
