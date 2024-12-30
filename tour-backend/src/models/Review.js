const mongoose = require('mongoose');
const { Schema } = mongoose;

const reviewSchema = new Schema({
    review: {
        type: String,
        required: [true, 'Review text is required']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating is required']
    },
    tour: {
        type: Schema.Types.ObjectId,
        ref: 'Tour',
        require: true, 
        index:true, 
        unique:true,
        sparse:true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});



const Review = mongoose.model('Review', reviewSchema);

module.exports = Review;
