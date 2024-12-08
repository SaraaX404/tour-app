const Tour = require('../models/tour');
const catchAsync = require('../utils/catchAsync');

// Get all tours
exports.getAllTours = catchAsync(async (req, res) => {
    const tours = await Tour.find().populate('destinations');
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: { tours }
    });
});

// Create new tour
exports.createTour = catchAsync(async (req, res) => {
    const newTour = await Tour.create(req.body);
    res.status(201).json({
        status: 'success',
        data: { tour: newTour }
    });
});

// Get single tour
exports.getTour = catchAsync(async (req, res) => {
    const tour = await Tour.findById(req.params.id).populate({
        path: 'destinations',
        populate: {
            path: 'hotels'
        }
    });
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Tour not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

// Update tour
exports.updateTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
        runValidators: true
    }).populate('destinations');
    
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Tour not found'
        });
    }
    res.status(200).json({
        status: 'success',
        data: { tour }
    });
});

// Delete tour
exports.deleteTour = catchAsync(async (req, res) => {
    const tour = await Tour.findByIdAndDelete(req.params.id);
    if (!tour) {
        return res.status(404).json({
            status: 'fail',
            message: 'Tour not found'
        });
    }
    res.status(204).json({
        status: 'success',
        data: null
    });
});
 