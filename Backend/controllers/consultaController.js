const Consulta = require("../models/consulta");

exports.crearConsulta = async (req, res) => {
  try {
    const { nombre, rut, email, telefono, fechaNacimiento, fechaConsulta } =
      req.body;

    // Validaciones básicas
    if (
      !nombre ||
      !rut ||
      !email ||
      !telefono ||
      !fechaNacimiento ||
      !fechaConsulta
    ) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios.",
      });
    }

    // Crear nueva instancia de consulta
    const nuevaConsulta = new Consulta({
      nombre,
      rut,
      email,
      telefono,
      fechaNacimiento,
      fechaConsulta,
    });

    await nuevaConsulta.save();

    res.status(201).json({ success: true, data: nuevaConsulta });
  } catch (error) {
    console.error("Error al crear consulta:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor." });
  }
};

exports.obtenerConsultas = async (req, res) => {
  try {
    const consultas = await Consulta.find().sort({ fechaConsulta: 1 }); // ordenadas por fecha
    res.status(200).json({ success: true, data: consultas });
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor." });
  }
};
