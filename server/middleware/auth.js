const jwt  = require('jsonwebtoken');
const User = require('../models/User');

const JWT_SECRET = process.env.JWT_SECRET || 'strng_secret_2025_change_in_prod';

/* ── Verificar token JWT ───────────────────────────── */
const verificarToken = async (req, res, next) => {
  try {
    const auth = req.headers.authorization;

    if (!auth || !auth.startsWith('Bearer ')) {
      return res.status(401).json({
        ok:    false,
        error: 'Token requerido. Inicia sesión.',
      });
    }

    const token = auth.split(' ')[1];

    let decoded;
    try {
      decoded = jwt.verify(token, JWT_SECRET);
    } catch (err) {
      const msg = err.name === 'TokenExpiredError'
        ? 'Sesión expirada. Inicia sesión nuevamente.'
        : 'Token inválido.';
      return res.status(401).json({ ok: false, error: msg });
    }

    const user = await User.findById(decoded.id).select('-password');
    if (!user || !user.activo) {
      return res.status(401).json({ ok: false, error: 'Usuario no encontrado o inactivo.' });
    }

    req.user = user;
    next();
  } catch (err) {
    console.error('Auth middleware error:', err);
    res.status(500).json({ ok: false, error: 'Error interno de autenticación.' });
  }
};

/* ── Solo admins ───────────────────────────────────── */
const soloAdmin = (req, res, next) => {
  if (!req.user || req.user.role !== 'admin') {
    return res.status(403).json({
      ok:    false,
      error: 'Acceso denegado. Se requiere rol de administrador.',
    });
  }
  next();
};

/* ── Middleware combinado: token + admin ───────────── */
const authAdmin = [verificarToken, soloAdmin];

/* ── Helper: generar token ─────────────────────────── */
const generarToken = (userId) => {
  return jwt.sign({ id: userId }, JWT_SECRET, { expiresIn: '8h' });
};

module.exports = { verificarToken, soloAdmin, authAdmin, generarToken };
