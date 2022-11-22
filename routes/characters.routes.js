const express = require('express');
const Character = require('../models/Characters.js');

const charactersRouter = express.Router();

charactersRouter.get('/', async (req, res) => {
    try {
        const characters = await Character.find();
        // .json(datos) == .send(datos) pero me los transforma directamente al formato correcto para objetos
        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json(err);
    }
});

charactersRouter.get('/:id', async (req, res) => {
    const id = req.params.id;
    try {
        const character = await Character.findById(id);
        if (character) {
            return res.status(200).json(character);
        } else {
            return res.status(404).json('No existe un personaje con el id indicado');
        }
    } catch (err) {
        return res.status(500).json(err);
    }
});

charactersRouter.get('/age/:age', async (req, res) => {
    const age = req.params.age;
    try {
        const characters = await Character.find({
            age: { $gt: age }
        }, {
            alias: 1,
            _id: 0
        });
        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json(err);
    }
});

charactersRouter.get('/skill/:skill', async (req, res) => {
    const skill = req.params.skill;
    try {
        const characters = await Character.find({
            skills: { $in: [skill] }
        });
        return res.status(200).json(characters);
    } catch (err) {
        return res.status(500).json(err);
    }
});

module.exports = charactersRouter;