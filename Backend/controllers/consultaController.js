const Consulta = require('../models/consulta');

exports.crearConsulta = async (req, res) => {
  try {
    const nuevaConsulta = new Consulta(req.body);
    await nuevaConsulta.save();
    res.status(201).json({ success: true, data: nuevaConsulta });
  } catch (error) {
    res.status(400).json({ success: false, error: error.message });
  }
};

exports.obtenerConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.find().sort({ fecha: 1 });
    res.json({ success: true, data: consultas });
  } catch (error) {
    res.status(500).json({ success: false, error: error.message });
  }
};