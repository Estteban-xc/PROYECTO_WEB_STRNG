const router          = require('express').Router();
const User            = require('../models/User');
const { verificarToken, generarToken } = require('../middleware/auth');

/* ── POST /api/auth/login ──────────────────────────── */
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ ok: false, error: 'Usuario y contraseña requeridos.' });
    }

    const user = await User.findOne({ username: username.toLowerCase().trim() });
    if (!user || !user.activo) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    }

    const match = await user.compararPassword(password);
    if (!match) {
      return res.status(401).json({ ok: false, error: 'Credenciales incorrectas.' });
    }

    const token = generarToken(user._id);

    res.json({
      ok: true,
      token,
      user: {
        id:       user._id,
        username: user.username,
        nombre:   user.nombre,
        role:     user.role,
      },
    });
  } catch (err) {
    console.error('Login error:', err);
    res.status(500).json({ ok: false, error: 'Error interno del servidor.' });
  }
});

/* ── GET /api/auth/verify ──────────────────────────── */
router.get('/verify', verificarToken, (req, res) => {
  res.json({
    ok:   true,
    user: {
      id:       req.user._id,
      username: req.user.username,
      nombre:   req.user.nombre,
      role:     req.user.role,
    },
  });
});

/* ── POST /api/auth/logout ─────────────────────────── */
// El logout real ocurre en el cliente eliminando el token.
// Este endpoint existe para confirmar y limpiar sesión.
router.post('/logout', verificarToken, (req, res) => {
  res.json({ ok: true, mensaje: 'Sesión cerrada correctamente.' });
});

/* ── POST /api/auth/seed ───────────────────────────── */
// Solo en desarrollo: crea el admin por defecto si no existe.
router.post('/seed', async (req, res) => {
  if (process.env.NODE_ENV === 'production') {
    return res.status(403).json({ ok: false, error: 'No disponible en producción.' });
  }
  try {
    const existe = await User.findOne({ username: 'admin' });
    if (existe) {
      return res.json({ ok: true, mensaje: 'Admin ya existe.', user: existe });
    }
    const admin = await User.create({
      username: 'admin',
      password: 'strng2025',
      nombre:   'Administrador STRNG',
      role:     'admin',
    });
    res.status(201).json({ ok: true, mensaje: 'Admin creado.', user: admin });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
});

module.exports = router;
