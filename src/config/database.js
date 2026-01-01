const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);

    console.log(`✅ Conexión a MongoDB exitosa: ${conn.connection.host}`);
    console.log(`📦 Base de datos: ${conn.connection.name}`);
  } catch (error) {
    console.error("❌ Error al conectar a MongoDB:", error.message);
    process.exit(1);
  }
};

mongoose.connection.on("disconnected", () => {
  console.log("⚠️  MongoDB desconectado");
});

mongoose.connection.on("error", (err) => {
  console.error("❌ Error de conexión MongoDB:", err);
});

process.on("SIGINT", async () => {
  await mongoose.connection.close();
  console.log("🔌 Conexión a MongoDB cerrada por terminación de la aplicación");
  process.exit(0);
});

module.exports = connectDB;
