const express = require('express');
const router = express.Router();
const {
    getAllDestinations,
    createDestination,
    getDestination,
    updateDestination,
    deleteDestination
} = require('../controllers/destination');

// Destination routes
router.route('/')
    .get(getAllDestinations)
    .post(createDestination);

router.route('/:id')
    .get(getDestination)
    .patch(updateDestination)
    .delete(deleteDestination);

module.exports = router;
