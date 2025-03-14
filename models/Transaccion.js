const mongoose = require('mongoose');

const transaccionSchema = new mongoose.Schema({
  tarjeta_id: {
    type: String,
    required: true,
    match: /^[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}:[0-9A-F]{2}$/i,
    ref: 'Usuario'
  },
  tipo: {
    type: String,
    required: true,
    enum: ['Recarga', 'Uso', 'Reembolso']
  },
  monto: {
    type: Number,
    required: true
  },
  fecha: {
    type: Date,
    default: Date.now
  },
  metodo_pago: {
    type: String,
    required: true
  }
});

module.exports = mongoose.model('Transaccion', transaccionSchema, 'transacciones');