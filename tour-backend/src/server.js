const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const connectDB = require('./config/db.config');
const tourRouter = require('./routes/tour');
const hotelRouter = require('./routes/hotel');
const commonRouter = require('./routes/common');
const destinationRouter = require('./routes/destination');
// Load environment variables
dotenv.config();

// Create Express app
const app = express();

// Enable CORS for all origins
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
}));

// Body parser middleware
app.use(express.json());

// Connect to database
connectDB();

// Mount routes
app.use('/api/v1/tours', tourRouter);
app.use('/api/v1/hotels', hotelRouter);
app.use('/api/v1/common', commonRouter);
app.use('/api/v1/destinations', destinationRouter);
// Error handling middleware
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({
        status: 'error',
        message: 'Something went wrong!'
    });
});

// Start server
const PORT = process.env.PORT || 3000;

app.get('/', (req, res) => {
    res.send('Hello World');
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
