const express = require('express');
const router = express.Router();
const {
    getAllTours,
    createTour,
    getTour,
    updateTour,
    deleteTour,
    addDestination,
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


    
module.exports = router;
