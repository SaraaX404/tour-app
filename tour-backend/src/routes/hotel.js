const express = require('express');
const router = express.Router();
const {
    getAllHotels,
    createHotel,
    getHotel, 
    updateHotel,
    deleteHotel
} = require('../controllers/hotel');

// Hotel routes
router.route('/')
    .get(getAllHotels)
    .post(createHotel);

router.route('/:id')
    .get(getHotel)
    .patch(updateHotel)
    .delete(deleteHotel);

module.exports = router;
