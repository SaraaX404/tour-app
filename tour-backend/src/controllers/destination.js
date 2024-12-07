const Destination = require('../models/Destination');

// Get all destinations
exports.getAllDestinations = async (req, res) => {
    try {
        const destinations = await Destination.find().populate('hotels');
        
        res.status(200).json({
            status: 'success',
            results: destinations.length,
            data: {
                destinations
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Create new destination
exports.createDestination = async (req, res) => {
    try {
        const newDestination = await Destination.create(req.body);

        res.status(201).json({
            status: 'success',
            data: {
                destination: newDestination
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail', 
            message: err.message
        });
    }
};

// Get single destination
exports.getDestination = async (req, res) => {
    try {
        const destination = await Destination.findById(req.params.id).populate('hotels');

        if (!destination) {
            return res.status(404).json({
                status: 'fail',
                message: 'No destination found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                destination
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Update destination
exports.updateDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndUpdate(
            req.params.id,
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!destination) {
            return res.status(404).json({
                status: 'fail',
                message: 'No destination found with that ID'
            });
        }

        res.status(200).json({
            status: 'success',
            data: {
                destination
            }
        });
    } catch (err) {
        res.status(400).json({
            status: 'fail',
            message: err.message
        });
    }
};

// Delete destination
exports.deleteDestination = async (req, res) => {
    try {
        const destination = await Destination.findByIdAndDelete(req.params.id);

        if (!destination) {
            return res.status(404).json({
                status: 'fail',
                message: 'No destination found with that ID'
            });
        }

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
