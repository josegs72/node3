const passport = require('passport');
const User = require('../../models/Users');
const LocalStrategy = require('passport-local').Strategy;
const bcrypt = require('bcrypt');
const createError = require('../errors/create-error');

// Crea una nueva estrategia de autenticación de usuarios
// 1. Nombre estrategia
// 2. Nueva estrategia --> lo cogemos de passport-local
// 2.1 Configuración de la estrategia
// - usernameField: Campo del user schema que utilizaremos como nombre de usuario
// - passwordField: Lo mismo pero con campo del schema que utilizamos como contraseña
// - passReqToCallback: Indica con boolean si se debe pasar la request a la callback
// 2.2 Callback que se ejecuta cada vez que se registra un usuario --> aprovechamos para guardar usuario en la BD.
passport.use(
    'register',
    new LocalStrategy(
        {
            usernameField: "email",
            passwordField: "password",
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                // done: Función de callback que ejecutaremos cuando hayamos terminado la lógica de registro
                // 1. Error que se ha producido --> si no hay error pasamos null
                // 2. Usuario creado en caso de éxito

                // Comprobar que el usuario que se intenta registrar no existe (buscamos por email)
                const previousUser = await User.findOne({ email });

                if (previousUser) {
                    return done(createError('Este usuario ya existe, inicia sesión'));
                }

                // Encriptar contraseña antes de guardarla
                // Hash: Encripta el dato que pasemos
                // 1. Dato a encriptar (string)
                // 2. saltRounds: Número de rondas que se aplican a la hora de encriptar. (10 por defecto)
                const encPassword = await bcrypt.hash(password, 10);

                // Creamos el nuevo usuario
                const newUser = new User({
                    email,
                    password: encPassword
                });
                // Guardamos usuario en BD
                const savedUser = await newUser.save();

                return done(null, savedUser);
            } catch (err) {
                return done(err);
            }       
        }
    )
);

// Creamos una estrategia en caso de login
passport.use(
    'login',
    new LocalStrategy(
        {
            usernameField: 'email',
            passwordField: 'password',
            passReqToCallback: true
        },
        async (req, email, password, done) => {
            try {
                // Miramos si el usuario que nos pasan existe o no
                const currentUser = await User.findOne({ email });

                // Si no existe el usuario devolvemos error
                if (!currentUser) {
                    return done(createError('No existe un usuario con este email, regístrate'));
                }

                // Comprobamos si la contraseña del usuario coincide con el usuario en la BD.
                // Compare: Contraseña sin encriptar con contraseña encriptada
                // Devuelve true si son iguales o false si son distintas
                const isValidPassword = await bcrypt.compare(
                    password,
                    currentUser.password
                );

                if (!isValidPassword) {
                    return done(createError('La contraseña es incorrecta'));
                }

                currentUser.password = null;
                return done(null, currentUser);
            } catch (err) {
                return done(err);
            }
        }
    )
);

// Registrar el usuario por su id de la BD
passport.serializeUser((user, done) => {
    // Devolvemos id para correspondencia con la BD.
    return done(null, user._id);
});

// Busca un usuario en función de su id
passport.deserializeUser(async (userId, done) => {
    try {
        const existingUser = await User.findById(userId);
        return done(null, existingUser);
    } catch (err) {
        return done(err);
    }
});