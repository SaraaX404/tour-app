const express = require('express');
const router = express.Router();
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    createReview,
    addDestination,
    getReviews,
    addHotel
} = require('../controllers/tour');

// Tour routes
router.route('/')
    .get(getAllTours)
    .post(createTour);

router.route('/:id')
    .get(getTour)
    .patch(updateTour)
    .delete(deleteTour);

router.route('/:id/reviews')
    .post(createReview);

router.route('/:id/reviews')
    .get(getReviews);

    
module.exports = router;

