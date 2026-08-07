const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const clientRepository = require('../repositories/clientRepository');
const { pool } = require('../database/db');

const JWT_SECRET = process.env.JWT_SECRET || 'alianza_salud_secret_key_2026_phase3';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '24h';

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
 * Registrar nuevo usuario Cliente mediante Código de Verificación de 8 Caracteres.
 * POST /api/auth/register
 */
async function register(req, res, next) {
  try {
    const { verificationCode, email, password } = req.body;

    if (!verificationCode || !email || !password) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'Debe ingresar su Código de Verificación de 8 caracteres, Correo y Contraseña.',
          status: 400,
        },
      });
    }

    if (String(verificationCode).trim().length !== 8) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'El Código de Verificación debe tener exactamente 8 caracteres alfanuméricos.',
          status: 400,
        },
      });
    }

    if (password.length < 6) {
      return res.status(400).json({
        success: false,
        error: { message: 'La contraseña debe tener al menos 6 caracteres.', status: 400 },
      });
    }

    // 1. Buscar cliente por código de 8 caracteres en el Maestro de Clientes
    const targetClient = await clientRepository.findByVerificationCode(verificationCode);
    if (!targetClient) {
      return res.status(404).json({
        success: false,
        error: {
          message: 'Código de verificación inválido. Por favor confirme el código asignado por la administración.',
          status: 404,
        },
      });
    }

    if (targetClient.user_id) {
      return res.status(409).json({
        success: false,
        error: {
          message: 'Este Código de Verificación ya fue utilizado para registrar una cuenta.',
          status: 409,
        },
      });
    }

    // 2. Verificar si el correo ya está registrado
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(409).json({
        success: false,
        error: { message: 'El correo electrónico ya se encuentra registrado.', status: 409 },
      });
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Crear usuario cliente con el nombre registrado en el Maestro de Clientes
    const newUser = await userRepository.create({
      fullName: targetClient.full_name,
      email,
      passwordHash,
      role: 'client',
      phone: targetClient.phone || '',
    });

    // 5. Vincular cliente y sus casos con el nuevo user_id
    await clientRepository.linkUserId(targetClient.id, newUser.id);
    if (pool) {
      await pool.query('UPDATE cases SET user_id = ? WHERE client_id = ? OR verification_code = ?', [
        newUser.id,
        targetClient.id,
        verificationCode,
      ]);
    }

    const token = generateToken(newUser);

    return res.status(201).json({
      success: true,
      message: 'Registro de cliente completado exitosamente.',
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

    const account = await userRepository.findByEmail(email);
    if (!account) {
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas. Verifique su correo o contraseña.', status: 401 },
      });
    }

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

async function getProfile(req, res, next) {
  try {
    const user = await userRepository.findById(req.user.id);
    if (!user) {
      return res.status(404).json({
        success: false,
        error: { message: 'Usuario no encontrado.', status: 404 },
      });
    }
    return res.json({ success: true, data: user });
  } catch (error) {
    next(error);
  }
}

module.exports = {
  register,
  login,
  getProfile,
};
