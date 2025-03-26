//tarjetas.js
const express = require('express');
const router = express.Router();
const mongoose = require('mongoose');
const Transaccion = require('../models/Transaccion');


// Endpoint para obtener el saldo de una tarjeta
router.get('/saldo/:tarjetaId', async (req, res) => {
  try {
    const tarjetaId = req.params.tarjetaId;
    
    // Validar formato del ID de tarjeta
    if (!tarjetaId) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'ID de tarjeta inválido' 
      });
    }
    
    // Buscar todas las transacciones para esta tarjeta
    const transacciones = await Transaccion.find({ tarjeta_id: tarjetaId });
    
    // Calcular el saldo igual que lo hace el frontend
    const saldo = transacciones.reduce((acc, curr) => acc + curr.monto, 0);
    
    res.json({ 
      success: true,
      tarjetaId, 
      saldo: saldo.toFixed(2),
      transacciones: transacciones.length
    });
  } catch (error) {
    console.error('Error al obtener saldo:', error);
    res.status(500).json({ success: false, mensaje: 'Error al obtener saldo' });
  }
});

// Endpoint para deducir saldo (para ESP32)
router.post('/cobrar', async (req, res) => {
  try {
    const { tarjetaId, monto, autobusId, rutaId } = req.body;
    
    // Validar datos requeridos
    if (!tarjetaId || !monto) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Se requieren ID de tarjeta y monto' 
      });
    }
    
    // Convertir el monto a número y validar
    const montoNumerico = parseFloat(monto);
    if (isNaN(montoNumerico) || montoNumerico <= 0) {
      return res.status(400).json({
        success: false,
        mensaje: 'El monto debe ser un número positivo'
      });
    }
    
    // Buscar todas las transacciones para esta tarjeta
    const transacciones = await Transaccion.find({ tarjeta_id: tarjetaId });
    
    // Calcular el saldo actual
    const saldoActual = transacciones.reduce((acc, curr) => acc + curr.monto, 0);
    
    // Validar saldo suficiente
    if (saldoActual < montoNumerico) {
      return res.status(400).json({ 
        success: false, 
        mensaje: 'Saldo insuficiente',
        saldoActual: saldoActual.toFixed(2) 
      });
    }
    
    // Crear nueva transacción para el cobro
    const nuevaTransaccion = new Transaccion({
      tarjeta_id: tarjetaId,
      tipo: 'Uso',  // Usa 'Uso' en lugar de 'Pago de Pasaje' para coincidir con tu enum
      monto: -montoNumerico,
      metodo_pago: 'Tarjeta',  // Necesitas este campo porque es required en tu modelo
      detalles: {
        autobusId,
        rutaId,
        hora: new Date()
      }
    });
    
    // Guardar la transacción
    await nuevaTransaccion.save();
    
    // Calcular nuevo saldo
    const nuevoSaldo = (saldoActual - montoNumerico).toFixed(2);
    
    res.json({ 
      success: true, 
      mensaje: 'Pago procesado correctamente', 
      nuevoSaldo,
      transaccionId: nuevaTransaccion._id
    });
  } catch (error) {
    console.error('Error al procesar pago:', error);
    res.status(500).json({ success: false, mensaje: 'Error al procesar pago' });
  }
});

module.exports = router;