const mongoose = require('mongoose');

const hotelSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Hotel name is required'],
        trim: true
    },
    description: {
        type: String,
        required: [true, 'Hotel description is required']
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
    destination: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Destination',
        required: [true, 'Hotel must belong to a destination']
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Hotel', hotelSchema);
