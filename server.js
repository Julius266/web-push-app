const express = require("express");
const connectDB = require("./config/db");
const notificationRoutes = require("./routes/notificationRoutes");
const analyticsRouter = require("./routes/analyticsRoutes"); // Importa las rutas de analytics
require("dotenv").config();
const cors = require("cors");

const app = express();

// Conectar a MongoDB
connectDB();

app.use(cors());

// Middlewares
app.use(express.json());

// Rutas
app.use("/api/notifications", notificationRoutes);
app.use("/api", analyticsRouter); // Agrega la nueva ruta para tracking de visitas

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
