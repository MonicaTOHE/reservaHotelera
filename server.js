require("dotenv").config();
const express = require("express");
const app = express();

// Importa tu router
const router = require("./routes/routes"); // Asegúrate de que el path sea correcto

app.use(express.json());
// Usa el router que creaste
app.use("/api", router);

// Configura el puerto
const PORT = process.env.PORT;

// Arranca la aplicación
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
