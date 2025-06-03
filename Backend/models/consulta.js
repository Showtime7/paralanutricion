const mongoose = require("mongoose");

const consultaSchema = new mongoose.Schema({
  nombreCompleto: {
    type: String,
    required: true,
    trim: true,
  },
  rut: {
    type: String,
    required: true,
    trim: true,
  },
  email: {
    type: String,
    required: true,
    trim: true,
  },
  telefono: {
    type: String,
    required: true,
    trim: true,
  },
  fechaNacimiento: {
    type: Date,
    required: true,
  },
  fechaConsulta: {
    type: String, // Puedes usar Date si combinas fecha y hora
    required: true,
  },
  horaConsulta: {
    type: String,
    required: true,
  },
  creadoEn: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model("Consulta", consultaSchema);
