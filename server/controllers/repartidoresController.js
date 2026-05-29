const { Repartidor, Paquete } = require('../models');

// GET /api/repartidores — Listar todos
exports.listar = async (req, res) => {
  try {
    const repartidores = await Repartidor.find({ activo: true });
    res.json({ ok: true, repartidores });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// GET /api/repartidores/ubicaciones — Coordenadas de flota activa
exports.ubicaciones = async (req, res) => {
  try {
    const repartidores = await Repartidor.find({ activo: true, estado: { $ne: 'Descanso' } })
      .select('nombre estado vehiculo ubicacion');
    res.json({ ok: true, repartidores });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// POST /api/repartidores — Crear repartidor
exports.crear = async (req, res) => {
  try {
    const repartidor = new Repartidor(req.body);
    await repartidor.save();
    res.status(201).json({ ok: true, repartidor });
  } catch (err) {
    res.status(400).json({ ok: false, error: err.message });
  }
};

// PUT /api/repartidores/:id/ubicacion — Actualizar GPS
exports.actualizarUbicacion = async (req, res) => {
  try {
    const { lat, lng, direccion } = req.body;
    const repartidor = await Repartidor.findByIdAndUpdate(
      req.params.id,
      {
        'ubicacion.lat': lat,
        'ubicacion.lng': lng,
        'ubicacion.direccion': direccion || '',
        'ubicacion.ultimaActualizacion': new Date()
      },
      { new: true }
    );
    if (!repartidor) return res.status(404).json({ ok: false, error: 'No encontrado' });
    res.json({ ok: true, repartidor });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// PUT /api/repartidores/:id — Actualizar estado
exports.actualizar = async (req, res) => {
  try {
    const repartidor = await Repartidor.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!repartidor) return res.status(404).json({ ok: false, error: 'No encontrado' });
    res.json({ ok: true, repartidor });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};

// DELETE /api/repartidores/:id
exports.eliminar = async (req, res) => {
  try {
    await Repartidor.findByIdAndUpdate(req.params.id, { activo: false });
    res.json({ ok: true, mensaje: 'Repartidor desactivado' });
  } catch (err) {
    res.status(500).json({ ok: false, error: err.message });
  }
};
