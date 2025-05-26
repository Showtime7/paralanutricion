// 1. Importar dependencias
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const consultaRoutes = require('./routes/consultaRoutes');
app.use('/api', consultaRoutes);

// 2. Crear la aplicación Express
const app = express();

// 3. Middlewares (funciones intermedias)
app.use(cors()); // Permite conexiones desde tu frontend
app.use(express.json()); // Para procesar JSON en las peticiones

// 4. Conexión a MongoDB (usaremos MongoDB Atlas - gratis)
mongoose.connect(process.env.MONGODB_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true
})
.then(() => console.log('✅ Conectado a MongoDB'))
.catch(err => console.error('❌ Error de conexión:', err));

// 5. Ruta de prueba
app.get('/', (req, res) => {
  res.send('Backend de Nutrición funcionando!');
});

// 6. Iniciar servidor
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
});