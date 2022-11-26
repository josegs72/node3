const mongoose = require('mongoose');

const locationsSchema = new mongoose.Schema({
    name: { type: String, required: true },
    loot: { type: [String], required: true },
    equipment: {
        type: [String],
        enum: {
            values: ["Pistola", 'Cuchillo', "Bombas", "Ordenador", "Disfraz"],
            message: "A donde vas atracando con eso!"
        }
    },
    hostages: [String],
    // Tipo mongoose.Types.ObjectId se refiere a ids de documentos de la colección indicada en el campo "ref"
    robbers: [{ type: mongoose.Types.ObjectId, ref: 'Character' }]
}, {
    timestamps: true
});

const Location = mongoose.model('Location', locationsSchema);

module.exports = Location;