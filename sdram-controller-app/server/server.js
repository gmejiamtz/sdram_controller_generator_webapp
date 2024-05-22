// server/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database connection
mongoose.connect(process.env.MONGO_URI, {})
  .then(() => console.log('MongoDB connected'))
  .catch(err => console.error(err));

// Routes
app.get('/', (req, res) => {
    res.send('Hello World!');
});

const generator_router = require('./routes/generate_verilog');
const datasheet_router = require('./routes/datasheet');

app.use('/generate_verilog',generator_router);
app.use('/datasheet', datasheet_router);

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
