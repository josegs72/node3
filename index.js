const express = require('express');
const charactersRouter = require('./routes/characters.routes.js');
const connect = require('./utils/db/connect.js');
const cors = require('cors');
const createError = require('./utils/errors/create-error.js');
const locationsRouter = require('./routes/locations.routes.js');

// Me conecta a la base de datos.
connect();

const PORT = 3000;
const server = express();

// Evita errores de CORS, instalar antes la dependencia cors --> npm install --save cors
server.use(cors());
// Nos permite parsear los body de las peticiones POST y PUT que vienen como JSON
server.use(express.json());
// Nos permite parsear los body de las peticiones POST y PUT que vienen como string o array
server.use(express.urlencoded({ extended: false }));

server.use('/characters', charactersRouter);

server.use('/locations', locationsRouter);

// * --> Cualquier ruta que no haya sido identificada en los anteriores server use entrará por aquí
server.use('*', (req, res, next) => {
    next(createError('Esta ruta no existe', 404));
});

// Manejo de errores
// Además de los típicos req, res y next se añade un parámetro error
// - Error: error emitido desde el paso previo del servidor
server.use((err, req, res, next) => {
    return res.status(err.status || 500).json(err.message || 'Unexpected error');
});

server.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});