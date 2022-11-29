const express = require('express');
const passport = require('passport');

const userRouter = express.Router();

userRouter.post('/register', (req, res, next) => {
    // Función done que le llega a la estrategia en passport.js
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        // Nos permite iniciar sesión con el usuario creado
        // 1. Usuario
        // 2. Callback --> se ejecuta cuando el usuario se loguea correctamente o si hay un error durante el login
        // 2.1 Error: Si se ha producido alguno
        req.logIn(
            user,
            (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(201).json(user);
            }
        );
    };

    // Creamos el autenticador de usuarios y lo ejecutamos con la request actual.
    // 1. Nombre de la estrategia a utilizar
    // 2. Callback done
    passport.authenticate('register', done)(req);
});

userRouter.post('/login', (req, res, next) => {
    // Función done que le llega a la estrategia en passport.js
    const done = (err, user) => {
        if (err) {
            return next(err);
        }
        // Nos permite iniciar sesión con el usuario creado
        // 1. Usuario
        // 2. Callback --> se ejecuta cuando el usuario se loguea correctamente o si hay un error durante el login
        // 2.1 Error: Si se ha producido alguno
        req.logIn(
            user,
            (err) => {
                if (err) {
                    return next(err);
                }
                return res.status(200).json(user);
            }
        );
    };

    // Creamos el autenticador de usuarios y lo ejecutamos con la request actual.
    // 1. Nombre de la estrategia a utilizar
    // 2. Callback done
    passport.authenticate('login', done)(req);
});

module.exports = userRouter;