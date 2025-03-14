const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  // Obtener token del header
  const token = req.header('x-auth-token');
  
  // Verificar si no hay token
  if (!token) {
    return res.status(401).json({ error: 'Acceso denegado, token no proporcionado' });
  }
  
  try {
    // Verificar token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'secretkey');
    
    // Añadir usuario a request
    req.usuario = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' });
  }
};