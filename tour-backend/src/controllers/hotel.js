const Hotel = require('../models/Hotel');
const Destination = require('../models/Destination');

// Get all hotels
exports.getAllHotels = async (req, res) => {
    try {
        const hotels = await Hotel.find().populate('destination');
        res.status(200).json({
            status: 'success',
            results: hotels.length,
            data: {
                hotels
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create new hotel
exports.createHotel = async (req, res) => {
    try {
        const destination = await Destination.findById(req.body.destination);
        if (!destination) {
            return res.status(404).json({
                status: 'fail',
                message: 'Destination not found'
            });
        }

        const newHotel = await Hotel.create(req.body);
        
        // Add hotel to destination's hotels array
        destination.hotels.push(newHotel._id);
        await destination.save();

        res.status(201).json({
            status: 'success',
            data: {
                hotel: newHotel
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Get single hotel
exports.getHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id).populate('destination');
        
        if (!hotel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update hotel
exports.updateHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true
        });

        if (!hotel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Hotel not found'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                hotel
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete hotel
exports.deleteHotel = async (req, res) => {
    try {
        const hotel = await Hotel.findById(req.params.id);
        
        if (!hotel) {
            return res.status(404).json({
                status: 'fail',
                message: 'Hotel not found'
            });
        }

        // Remove hotel reference from destination
        await Destination.findByIdAndUpdate(
            hotel.destination,
            { $pull: { hotels: hotel._id } }
        );

        await Hotel.findByIdAndDelete(req.params.id);

        res.status(204).json({
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};
