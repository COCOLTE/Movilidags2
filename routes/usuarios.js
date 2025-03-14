const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const bcrypt = require('bcryptjs');

// Obtener todos los usuarios
router.get('/', async (req, res) => {
  try {
    const usuarios = await Usuario.find().select('-password');
    res.json(usuarios);
  } catch (error) {
    console.error('Error al obtener usuarios:', error);
    res.status(500).json({ error: 'Error al obtener usuarios' });
  }
});

// Obtener usuario por ID
router.get('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.params.id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(`Error al obtener usuario ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al obtener usuario' });
  }
});

// Actualizar usuario
router.put('/:id', async (req, res) => {
  try {
    const { nombre, email, password, telefono, rol } = req.body;
    
    // Crear objeto con datos a actualizar
    const datosActualizados = {
      nombre,
      email,
      telefono,
      rol
    };
    
    // Si hay nueva contraseña, hashearla
    if (password) {
      const salt = await bcrypt.genSalt(10);
      datosActualizados.password = await bcrypt.hash(password, salt);
    }
    
    // Actualizar usuario
    const usuario = await Usuario.findByIdAndUpdate(
      req.params.id,
      datosActualizados,
      { new: true }
    ).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    console.error(`Error al actualizar usuario ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al actualizar usuario' });
  }
});

// Eliminar usuario
router.delete('/:id', async (req, res) => {
  try {
    const usuario = await Usuario.findByIdAndDelete(req.params.id);
    
    if (!usuario) {
      return res.status(404).json({ error: 'Usuario no encontrado' });
    }
    
    res.json({ message: 'Usuario eliminado exitosamente' });
  } catch (error) {
    console.error(`Error al eliminar usuario ${req.params.id}:`, error);
    res.status(500).json({ error: 'Error al eliminar usuario' });
  }
});

module.exports = router;