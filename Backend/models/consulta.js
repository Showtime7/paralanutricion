const mongoose = require('mongoose');

const ConsultaSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true },
  fecha: { type: Date, required: true },
  tipo: { type: String, enum: ['online', 'offline'], default: 'online' },
  previsión: { type: String, required: true },
  valor: { type: Number, required: true },
  pagado: { type: Boolean, default: false },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Consulta', ConsultaSchema);