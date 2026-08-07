const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');

const JWT_SECRET = process.env.JWT_SECRET || 'alianza_salud_secret_key_2026_phase3';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

/**
 * Generar token JWT para un usuario.
 */
function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    JWT_SECRET,
    { expiresIn: JWT_EXPIRES_IN }
  );
}

/**
 * Registrar nuevo usuario.
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { fullName, email, password, phone = '' } = req.body;

    if (!fullName || !email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor complete todos los campos obligatorios.', status: 400 },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'La contraseña debe tener al menos 6 caracteres.', status: 400 },
      });
    }

    // Verificar si el correo ya está registrado
    const existing = await userRepository.findByEmail(email);
    if (existing) {
      return res.status(409).json({
        success: false,
        error: { message: 'El correo electrónico ya se encuentra registrado.', status: 409 },
      });
    }

    // Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // Crear usuario
    const newUser = await userRepository.create({
      fullName,
      email,
      passwordHash,
      role: 'client',
      phone,
    });

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registro realizado exitosamente.',
      data: {
        token,
        user: newUser,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Iniciar sesión.
 * POST /api/auth/login
 */
async function login(req, res, next) {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({
        success: false,
        error: { message: 'Por favor ingrese su correo y contraseña.', status: 400 },
      });
    }

    // Buscar usuario por correo
    const account = await userRepository.findByEmail(email);
    if (!account) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas. Verifique su correo o contraseña.', status: 401 },
      });
    }

    // Comparar contraseña con el hash
    const isPasswordValid = await bcrypt.compare(password, account.passwordHash);
    if (!isPasswordValid) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas. Verifique su correo o contraseña.', status: 401 },
      });
    }

    if (!account.user.isActive) {
      return res.status(403).json({
        success: false,
        error: { message: 'Su cuenta se encuentra desactivada. Contacte a soporte.', status: 403 },
      });
    }

    const token = generateToken(account.user);

    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
        token,
        user: account.user,
      },
    });
  } catch (error) {
    next(error);
  }
}

/**
 * Obtener perfil del usuario autenticado.
 * GET /api/auth/me
 */
async function getProfile(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(44).json({
        success: false,
        error: { message: 'Usuario no encontrado.', status: 404 },
      });
    }

    return res.json({
      success: true,
      data: user,
    });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
