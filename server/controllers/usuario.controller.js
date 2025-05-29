import Usuario from '../models/Usuario.model.js';
import { generateToken } from '../config/jwt.js';

// Registrar un nuevo usuario
export const registrarUsuario = async (req, res) => {
  try {
    const { nombre, email, password, rol, entidadRelacionada } = req.body;
    
    // Verificar si el usuario ya existe
    const usuarioExiste = await Usuario.findOne({ email });
    if (usuarioExiste) {
      return res.status(400).json({ message: 'El email ya está registrado' });
    }

    // Crear usuario
    const usuario = await Usuario.create({
      nombre,
      email,
      password,
      rol,
      entidadRelacionada,
      rolModel: rol === 'fundacion' ? 'Fundacion' : rol === 'proveedor' ? 'Proveedor' : null
    });

    // Generar token JWT
    const token = generateToken(usuario._id);

    const response = {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token
    };
    if (usuario.entidadRelacionada) {
      response.entidadRelacionada = usuario.entidadRelacionada;
    }
    res.status(201).json(response);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Autenticar usuario
export const autenticarUsuario = async (req, res) => {
  try {
    const { email, password, rol } = req.body;
    console.log('Intento de login:', { email, rol });
    
    const usuario = await Usuario.findOne({ email });
    console.log('Usuario encontrado:', usuario ? { 
      _id: usuario._id, 
      email: usuario.email, 
      rol: usuario.rol,
      activo: usuario.activo 
    } : 'No encontrado');
    
    if (!usuario || !(await usuario.matchPassword(password))) {
      console.log('Fallo de autenticación: credenciales inválidas');
      return res.status(401).json({ message: 'Credenciales inválidas' });
    }

    if (!usuario.activo) {
      console.log('Fallo de autenticación: usuario inactivo');
      return res.status(401).json({ message: 'Usuario desactivado' });
    }

    if (rol && usuario.rol !== rol) {
      console.log('Fallo de autenticación: rol incorrecto', { rolSolicitado: rol, rolUsuario: usuario.rol });
      return res.status(403).json({ message: 'No tienes permisos para este rol' });
    }

    const token = generateToken(usuario._id);
    console.log('Login exitoso, token generado');

    const response = {
      _id: usuario._id,
      nombre: usuario.nombre,
      email: usuario.email,
      rol: usuario.rol,
      token
    };
    if (usuario.entidadRelacionada) {
      response.entidadRelacionada = usuario.entidadRelacionada;
    }

    // Si el cliente pide formato e-commerce (por header, query, etc.)
    if (req.headers['x-client'] === 'ecommerce') {
      res.json({ user: response, token: response.token });
    } else {
      res.json(response);
    }
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// Obtener perfil de usuario
export const obtenerPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.user._id).select('-password');
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    res.json(usuario);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Actualizar perfil de usuario
export const actualizarPerfil = async (req, res) => {
  try {
    const usuario = await Usuario.findById(req.userId);
    
    if (!usuario) {
      return res.status(404).json({ message: 'Usuario no encontrado' });
    }
    
    usuario.nombre = req.body.nombre || usuario.nombre;
    usuario.email = req.body.email || usuario.email;
    
    if (req.body.password) {
      usuario.password = req.body.password;
    }
    
    const usuarioActualizado = await usuario.save();
    
    res.json({
      _id: usuarioActualizado._id,
      nombre: usuarioActualizado.nombre,
      email: usuarioActualizado.email,
      rol: usuarioActualizado.rol
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};
// Crear usuario admin al iniciar (solo en desarrollo)
const crearAdminInicial = async () => {
  try {
    const adminExiste = await Usuario.findOne({ email: "admin@gmail.com" });
    if (!adminExiste) {
      await Usuario.create({
        nombre: "Administrador",
        email: "admin@gmail.com",
        password: "1234",
        rol: "admin"
      });
      console.log("✅ Usuario admin creado: admin@gmail.com / 1234");
    }
  } catch (error) {
    console.error("Error creando admin:", error.message);
  }
};

// Ejecutar al iniciar (solo en desarrollo)
crearAdminInicial();