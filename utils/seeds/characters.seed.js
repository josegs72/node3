// El archivo seed nos permite poblar la base de datos con unos datos iniciales.
// Nos permite resetear la base de datos al estado base que queramos.
const mongoose = require('mongoose');
const Character = require('../../models/Characters.js');
const fs = require('fs');

const DB_URL = "mongodb+srv://root:GKNM0qCJZ5Sjz7uN@moneyheist.8rg8c8y.mongodb.net/?retryWrites=true&w=majority";

mongoose.connect(DB_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true
// Dentro de la FUNCIÓN de callback de mi promesa pongo async para poder utilizar await
}).then(async () => {
    // Find nos permite buscar todos los elementos
    const allCharacters = await Character.find();

    // Si hay documentos en la colección
    if (allCharacters.length) {
        // Elimina todo el contenido de la colección
        await Character.collection.drop();
    }
}).catch(err => {
    console.log(`Ha habido un error eliminando los datos: ${err}`);
})
.then(async () => {
    // Añadir los nuevos elementos a nuestra colección.
    const data = fs.readFileSync('./utils/seeds/db/characters.json');
    const parsedData = JSON.parse(data);
    const characterDocs = parsedData.map((character) => {
        return new Character(character);
    });
    await Character.insertMany(characterDocs);
})
.catch((err) => {
    console.log(`Ha habido un error añadiendo los elementos a la base de datos: ${err}`);
})
// mongoose.disconnect --> desconecta la conexión actual a la base de datos.
.finally(() => mongoose.disconnect());