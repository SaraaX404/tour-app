const mongoose = require('mongoose');

const destinationSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Destination name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Destination description is required']
    },
    location: {
        lat: {
            type: Number,
            required: [true, 'Latitude is required']
        },
        lng: {
            type: Number,
            required: [true, 'Longitude is required'] 
        }
    },
    photos: [{
        type: String
    }],
    hotels: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Hotel'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Destination', destinationSchema);
