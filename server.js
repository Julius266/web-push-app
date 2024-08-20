const express = require('express');
const connectDB = require('./config/db');
const notificationRoutes = require('./routes/notificationRoutes');
require('dotenv').config();

const app = express();

// Conectar a MongoDB
connectDB();

// Middlewares
app.use(express.json());
app.use(express.static('public'));

// Rutas
app.use('/api/notifications', notificationRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
