const mongoose = require('mongoose');
const { Schema } = mongoose;
const Destination = require('./Destination');

const tourSchema = new Schema({
    name: {
        type: String,
        required: [true, 'A tour must have a name'],
        unique: true,
        trim: true
    },
    description: {
        type: String,
        trim: true,
        required: [true, 'A tour must have a description']
    },
    destinations: [{
        type: Schema.Types.ObjectId,
        ref: 'Destination'
    }]
});

const Tour = mongoose.model('Tour', tourSchema);

module.exports = Tour;
