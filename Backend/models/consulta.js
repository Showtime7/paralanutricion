const Consulta = require("../models/consulta");

exports.crearConsulta = async (req, res) => {
  try {
    const {
      nombreCompleto,
      rut,
      email,
      telefono,
      fechaNacimiento,
      fechaConsulta,
      horaConsulta,
    } = req.body;

    // Validación básica de campos requeridos
    if (
      !nombreCompleto ||
      !rut ||
      !email ||
      !telefono ||
      !fechaNacimiento ||
      !fechaConsulta ||
      !horaConsulta
    ) {
      return res.status(400).json({
        success: false,
        error: "Todos los campos son obligatorios.",
      });
    }

    // Crear nueva instancia
    const nuevaConsulta = new Consulta({
      nombreCompleto,
      rut,
      email,
      telefono,
      fechaNacimiento,
      fechaConsulta,
      horaConsulta,
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
    const consultas = await Consulta.find().sort({ fechaConsulta: 1 });
    res.status(200).json({ success: true, data: consultas });
  } catch (error) {
    console.error("Error al obtener consultas:", error);
    res
      .status(500)
      .json({ success: false, error: "Error interno del servidor." });
  }
};
