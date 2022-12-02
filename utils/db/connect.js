const mongoose = require('mongoose');

// Almacenamos en una constante la url obtenida desde Mongo Atlas. (Sustituimos contraseña por la del usuario).
const DB_URL = "mongodb+srv://root:FxpjXX44HoZDpmP6@cluster0.jqruqhx.mongodb.net/?retryWrites=true&w=majority";
const connect = () => {
    // La función connect permite conectar nuestro servidor a MongoDB
    // 1. Url base de datos
    // 2. Opciones configuración
    mongoose.connect(DB_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true
    });
};

module.exports = connect;