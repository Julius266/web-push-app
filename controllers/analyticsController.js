const mongoose = require("mongoose");
const visitSchema = require("../models/Visit");  // Importar el esquema
const Visit = mongoose.model('Visit', visitSchema);  // Crear el modelo

// Función para registrar la pestaña visitada y guardarla en la base de datos
exports.registerVisit = async (req, res) => {
    const tabName = req.params.tabName;

    // Guardar la pestaña visitada en una cookie
    res.cookie('lastVisitedTab', tabName, { maxAge: 900000, httpOnly: true });

    // Registrar la visita en la base de datos
    const domain = req.headers.host;
    const visitedPages = [tabName];

    try {
        const visit = new Visit({
            domain: domain,
            visitedPages: visitedPages
        });

        await visit.save();
        res.status(200).send(`Visited ${tabName} and recorded in database.`);
    } catch (error) {
        console.error('Error al registrar visitas:', error);
        res.status(500).send('Hubo un error al registrar la visita.');
    }
};

// Función para verificar la última pestaña visitada desde la cookie
exports.getLastVisitedTab = (req, res) => {
    const lastVisitedTab = req.cookies.lastVisitedTab;
    if (lastVisitedTab) {
        res.status(200).send(`The last visited tab was: ${lastVisitedTab}`);
    } else {
        res.status(200).send('No tab has been visited yet.');
    }
};

// Función para registrar la aceptación de cookies
exports.acceptCookies = async (req, res) => {
    const domain = req.headers.host;

    try {
        const visit = new Visit({
            domain: domain,
            visitedPages: ["Cookies Accepted"]
        });

        await visit.save();

        res.cookie('cookiesAccepted', 'true', { maxAge: 31536000, httpOnly: true });
        res.status(200).send('Cookies have been accepted and logged.');
    } catch (error) {
        console.error('Error al registrar la aceptación de cookies:', error);
        res.status(500).send('Hubo un error al registrar la aceptación de cookies.');
    }
};

// Función para manejar la recepción de visitas desde el frontend
exports.trackVisit = async (req, res) => {
    const visitedPages = req.body.visitedPages;
    const domain = req.headers.host;

    try {
        const visit = new Visit({
            domain: domain,
            visitedPages: visitedPages
        });

        await visit.save();
        res.status(200).json({ message: 'Visited pages recorded successfully.' });
    } catch (error) {
        console.error('Error al registrar visitas:', error);
        res.status(500).json({ message: 'Hubo un error al registrar las visitas.' });
    }
};
