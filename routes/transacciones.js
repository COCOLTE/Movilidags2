const express = require('express');
const router = express.Router();
const Transaccion = require('../models/Transaccion');
const { client } = require('../paypalClient');

// Obtener todas las transacciones
router.get('/', async (req, res) => {
  try {
    const transacciones = await Transaccion.find();
    res.json(transacciones);
  } catch (error) {
    console.error('Error al obtener transacciones:', error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
});

// Obtener transacciones por ID de tarjeta
router.get('/tarjeta/:tarjetaId', async (req, res) => {
  try {
    const transacciones = await Transaccion.find({ tarjeta_id: req.params.tarjetaId });
    res.json(transacciones);
  } catch (error) {
    console.error(`Error al obtener transacciones de tarjeta ${req.params.tarjetaId}:`, error);
    res.status(500).json({ error: 'Error al obtener transacciones' });
  }
});

// Obtener transacción por ID
router.get('/:id', async (req, res) => {
  try {
    const transaccion = await Transaccion.findById(req.params.id);
    
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
    
    res.json(transaccion);
  } catch (error) {
    console.error(`Error al obtener transacción ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al obtener transacción' });
  }
});

// Crear transacción
router.post('/', async (req, res) => {
  try {
    const { tarjeta_id, tipo, monto, fecha, metodo_pago } = req.body;
    
    const transaccion = new Transaccion({
      tarjeta_id,
      tipo,
      monto,
      fecha: fecha || new Date(),
      metodo_pago
    });
    
    await transaccion.save();
    
    res.status(201).json(transaccion);
  } catch (error) {
    console.error('Error al crear transacción:', error);
    res.status(500).json({ error: 'Error al crear transacción' });
  }
});

// Actualizar transacción
router.put('/:id', async (req, res) => {
  try {
    const { tarjeta_id, tipo, monto, metodo_pago } = req.body;
    
    const transaccion = await Transaccion.findByIdAndUpdate(
      req.params.id,
      { tarjeta_id, tipo, monto, metodo_pago },
      { new: true }
    );
    
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
    
    res.json(transaccion);
  } catch (error) {
    console.error(`Error al actualizar transacción ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al actualizar transacción' });
  }
});

// Eliminar transacción
router.delete('/:id', async (req, res) => {
  try {
    const transaccion = await Transaccion.findByIdAndDelete(req.params.id);
    
    if (!transaccion) {
      return res.status(404).json({ error: 'Transacción no encontrada' });
    }
    
    res.json({ message: 'Transacción eliminada exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar transacción ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al eliminar transacción' });
  }
});


module.exports = router;