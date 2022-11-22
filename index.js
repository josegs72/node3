const express = require('express');
const charactersRouter = require('./routes/characters.routes.js');
const connect = require('./utils/db/connect.js');
const cors = require('cors');

// Me conecta a la base de datos.
connect();

const PORT = 3000;
const server = express();

// Evita errores de CORS, instalar antes la dependencia cors --> npm install --save cors
server.use(cors());

server.use('/characters', charactersRouter);

server.listen(PORT, () => {
    console.log(`El servidor está escuchando en http://localhost:${PORT}`);
});