const express = require('express');
const router = express.Router();
const Usuario = require('../models/Usuario');
const jwt = require('jsonwebtoken');

// Registro
router.post('/register', async (req, res) => {
  try {
    const { _id, nombre, email, password, telefono, rol, fecha_registro } = req.body;
    
    // Verificar si el usuario ya existe
    const existingUser = await Usuario.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ error: 'El correo electrónico ya está registrado' });
    }
    
    // Crear nuevo usuario
    const usuario = new Usuario({
      _id,
      nombre,
      email,
      password,
      telefono,
      rol: rol || 'estudiante',
      fecha_registro: fecha_registro || new Date()
    });
    
    await usuario.save();
    
    res.status(201).json({ message: 'Usuario registrado exitosamente' });
  } catch (error) {
    console.error('Error en registro:', error);
    res.status(500).json({ error: 'Error al registrar usuario' });
  }
});

// Login
router.post('/login', async (req, res) => {
  console.log('==== REQUEST DE LOGIN RECIBIDO ====');
  console.log('Headers:', req.headers);
  console.log('Body:', req.body);
  
  try {
    const { email, password } = req.body;
    console.log('Email a buscar:', email);
    
    if (!email || !password) {
      console.log('Email o password faltantes');
      return res.status(400).json({ error: 'Email y password son requeridos' });
    }
    
    // Buscar usuario
    const usuario = await Usuario.findOne({ email });
    if (!usuario) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // Verificar contraseña
    const isMatch = await usuario.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Credenciales incorrectas' });
    }
    
    // Generar token JWT (opcional, para autenticación más segura)
    const token = jwt.sign(
      { id: usuario._id, rol: usuario.rol },
      process.env.JWT_SECRET || 'secretkey',
      { expiresIn: '1d' }
    );
    
    // Enviar respuesta sin contraseña
    res.json({
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      telefono: usuario.telefono,
      rol: usuario.rol,
      fecha_registro: usuario.fecha_registro,
      token
    });
  } catch (error) {
    console.error('Error completo:', error);
    res.status(500).json({ error: 'Error al iniciar sesión' });;
  }
});

module.exports = router;