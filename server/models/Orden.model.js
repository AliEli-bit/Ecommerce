import mongoose from 'mongoose';

const ordenItemSchema = new mongoose.Schema({
  producto: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Producto',
    required: true
  },
  nombre: String,
  cantidad: {
    type: Number,
    required: true,
    min: 1
  },
  precioUnitario: {
    type: Number,
    required: true,
    min: 0
  },
  subtotal: {
    type: Number,
    required: true,
    min: 0
  }
});

const ordenSchema = new mongoose.Schema({
  numeroOrden: {
    type: String,
    required: true,
    unique: true
  },
  usuario: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Usuario',
    required: true
  },
  items: [ordenItemSchema],
  subtotal: {
    type: Number,
    required: true,
    min: 0
  },
  impuestos: {
    type: Number,
    default: 0
  },
  envio: {
    type: Number,
    default: 0
  },
  total: {
    type: Number,
    required: true,
    min: 0
  },
  direccionEnvio: {
    calle: String,
    ciudad: String,
    estado: String,
    codigoPostal: String,
    pais: { type: String, default: 'MX' }
  },
  datosContacto: {
    nombre: String,
    telefono: String,
    email: String
  },
  estadoPago: {
    type: String,
    enum: ['pendiente', 'procesando', 'completado', 'fallido', 'reembolsado'],
    default: 'pendiente'
  },
  estadoEnvio: {
    type: String,
    enum: ['pendiente', 'procesando', 'enviado', 'entregado', 'cancelado'],
    default: 'pendiente'
  },
  metodoPago: {
    type: String,
    enum: ['stripe', 'efectivo', 'transferencia'],
    default: 'stripe'
  },
  // Datos de Stripe
  stripePaymentIntentId: String,
  stripeChargeId: String,
  stripePagoDetalles: {
    marca: String,
    ultimos4: String,
    tipo: String
  },
  fechaPago: Date,
  notas: String
}, {
  timestamps: true
});

// Generar número de orden único
ordenSchema.pre('save', async function(next) {
  if (!this.numeroOrden) {
    const count = await mongoose.model('Orden').countDocuments();
    this.numeroOrden = `ORD-${Date.now()}-${count + 1}`;
  }
  next();
});

// Índices para mejorar el rendimiento
ordenSchema.index({ usuario: 1 });
ordenSchema.index({ numeroOrden: 1 });
ordenSchema.index({ estadoPago: 1 });
ordenSchema.index({ estadoEnvio: 1 });
ordenSchema.index({ createdAt: -1 });

const Orden = mongoose.models.Orden || mongoose.model('Orden', ordenSchema);

export default Orden;