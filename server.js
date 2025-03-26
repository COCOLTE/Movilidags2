// Importar rutas
const authRoutes = require('./routes/auth');
const usuariosRoutes = require('./routes/usuarios');
const transaccionesRoutes = require('./routes/transacciones');
const tarjetasRoutes = require('./routes/tarjetas');

// Inicializar app
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Conectar a MongoDB
mongoose.connect(process.env.MONGODB_URI || 'mongodb+srv://milyfers:popcorn@cluster0.qkin8.mongodb.net/movilidags', {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => console.log('Conectado a MongoDB'))
.catch(err => console.error('Error conectando a MongoDB:', err));

// Rutas
app.use('/api', authRoutes);
app.use('/api/usuarios', usuariosRoutes);
app.use('/api/transacciones', transaccionesRoutes);
app.use('/api/tarjetas',tarjetasRoutes);

// Manejo de errores
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Error del servidor' });
});

// Iniciar servidor
app.listen(PORT, '0.0.0.0', () => {
  console.log(`Servidor corriendo en puerto ${PORT} y aceptando conexiones externas`);
});