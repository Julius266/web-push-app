const mongoose = require('mongoose');

// Definir el esquema para las visitas
const visitSchema = new mongoose.Schema({
    domain: {
        type: String,
        required: true
    },
    visitedPages: {
        type: [String],
        required: true
    },
    timestamp: {
        type: Date,
        default: Date.now
    }
});

// Exportar el esquema como un modelo de Mongoose
module.exports = visitSchema;
