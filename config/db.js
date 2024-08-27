const mongoose = require("mongoose");
const dotenv = require("dotenv");

dotenv.config(); // Cargar variables de entorno

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGO_URI); // Conectar a MongoDB
    console.log("MongoDB Connected");
  } catch (err) {
    console.error(err.message); // Mostrar mensaje de error
    process.exit(1); // Finalizar el proceso
  }
};

module.exports = connectDB; // Exportar la función de conexión
