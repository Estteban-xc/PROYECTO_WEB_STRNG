require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3001;

// ── MIDDLEWARE ──────────────────────────────────────
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Servir archivos estáticos del frontend (carpeta padre)
app.use(express.static(path.join(__dirname, '..')));

// ── RUTAS API ───────────────────────────────────────
app.use('/api/auth',         require('./routes/auth'));
app.use('/api/productos',    require('./routes/products'));
app.use('/api/paquetes',     require('./routes/paquetes'));
app.use('/api/repartidores', require('./routes/repartidores'));

// Health check
app.get('/api/health', (req, res) => {
  res.json({ ok: true, mensaje: 'STRNG API corriendo', tiempo: new Date().toISOString() });
});

// Ruta catch-all → sirve el frontend (solo para rutas sin extensión de archivo)
app.get('*', (req, res) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ ok: false, error: 'Ruta no encontrada' });
  }
  // Si la ruta tiene extensión de archivo estático, dejar que Express lo maneje (404 real)
  if (/\.(png|jpg|jpeg|gif|svg|ico|mp4|mp3|css|js|woff|woff2|ttf|webp)$/i.test(req.path)) {
    return res.status(404).send('Archivo no encontrado');
  }
  res.sendFile(path.join(__dirname, '..', 'index.html'));
});

// ── MONGODB ─────────────────────────────────────────
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB conectado');
    app.listen(PORT, () => {
      console.log(`🚀 Servidor corriendo en http://localhost:${PORT}`);
      console.log(`📦 Admin panel: http://localhost:${PORT}/pages/admin.html`);
      console.log(`🔍 Rastreo:     http://localhost:${PORT}/pages/rastreo.html`);
    });
  })
  .catch(err => {
    console.error('❌ Error MongoDB:', err.message);
    process.exit(1);
  });
