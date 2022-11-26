const express = require('express');
const Location = require('../models/Locations.js');
const createError = require('../utils/errors/create-error');

const locationsRouter = express.Router();

locationsRouter.get('/', async (req, res, next) => {
    try {
        // Populate: Sustituye el id del documento por el documento al completo con toda su información
        const locations = await Location.find().populate('robbers');
        return res.status(200).json(locations);
    } catch (err) {
        next(err);
    }
});

locationsRouter.post('/', async (req, res, next) => {
    try {
        const newLocation = new Location({ ...req.body });
        const createdLocation = await newLocation.save();
        return res.status(201).json(createdLocation);
    } catch (err) {
        next(err);
    }
});

locationsRouter.put('/add-robber', async (req, res, next) => {
    try {
        const { locationId, characterId } = req.body;
        if (!locationId) {
            return next(createError('Se necesita un id de atraco para poder añadir el atracador', 500));
        }
        if (!characterId) {
            return next(createError('Se encesita un id de atracador para añadirlo', 500));
        }
        const updatedLocation = await Location.findByIdAndUpdate(
            locationId,
            { $push: { robbers: characterId } },
            { new: true }
        );
        return res.status(200).json(updatedLocation);
    } catch (err) {
        next(err);
    }
});

module.exports = locationsRouter;