const express = require("express");
const router = express.Router();
const Consulta = require("../models/Consulta"); // tu modelo de Mongoose

router.post("/consultas", async (req, res) => {
  try {
    const nuevaConsulta = new Consulta(req.body);
    await nuevaConsulta.save();
    res.status(201).json({ mensaje: "Reserva registrada correctamente" });
  } catch (error) {
    console.error("Error al guardar consulta:", error);
    res.status(500).json({ error: "Error al guardar consulta" });
  }
});

module.exports = router;
