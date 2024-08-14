require("dotenv").config();
const express = require('express');
const app = express();
const cors = require('cors');
const mongoose = require('mongoose');
const port = process.env.PORT;
const router = require("./src/routes");


const bodyParser = require('body-parser');
app.use(bodyParser.json());
app.use(cors());
app.use(router).listen(port, () => {
    console.log(`PORT: ${port}`);
  });
  
mongoose.connect('mongodb://localhost:27017/Finals')
    .then(() => {
        console.log('Connected to MongoDB');
    })
    .catch((err) => {
        console.error('Error connecting to MongoDB', err);
    });





