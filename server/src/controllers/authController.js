const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const userRepository = require('../repositories/userRepository');
const clientRepository = require('../repositories/clientRepository');
const config = require('../config');
const { recordAuditEvent } = require('../services/auditService');

function generateToken(user) {
  return jwt.sign(
    {
      id: user.id,
      email: user.email,
      fullName: user.fullName,
      role: user.role,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn, algorithm: config.jwt.algorithm }
  );
}

function setAuthCookie(res, token) {
  res.cookie(config.authCookie.name, token, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: config.authCookie.maxAgeMs,
  });
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

    if (password.length < 12) {
      return res.status(400).json({
        success: false,
        error: { message: 'La contraseña debe tener al menos 12 caracteres.', status: 400 },
      });
    }

    // 1. Buscar cliente por código de 8 caracteres en el Maestro de Clientes
    const targetClient = await clientRepository.findByVerificationCode(verificationCode);
    if (!targetClient) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No fue posible completar el registro con los datos proporcionados.',
          status: 400,
        },
      });
    }

    if (targetClient.user_id) {
      return res.status(400).json({
        success: false,
        error: {
          message: 'No fue posible completar el registro con los datos proporcionados.',
          status: 400,
        },
      });
    }

    // 2. Verificar si el correo ya está registrado
    const existingUser = await userRepository.findByEmail(email);
    if (existingUser) {
      return res.status(400).json({
        success: false,
        error: { message: 'No fue posible completar el registro con los datos proporcionados.', status: 400 },
      });
    }

    // 3. Encriptar contraseña
    const salt = await bcrypt.genSalt(10);
    const passwordHash = await bcrypt.hash(password, salt);

    // 4. Crear usuario cliente con el nombre registrado en el Maestro de Clientes
    const registration = await clientRepository.registerAccount({
      verificationCode,
      email: email.trim().toLowerCase(),
      passwordHash,
    });
    if (registration.error) {
      const status = registration.error === 'EMAIL_EXISTS' ? 409 : 400;
      return res.status(status).json({
        success: false,
        error: { message: 'No fue posible completar el registro con los datos proporcionados.', status },
      });
    }
    const newUser = registration.user;

    const token = generateToken(newUser);
    setAuthCookie(res, token);
    void recordAuditEvent(req, { event: 'AUTH_REGISTER_SUCCESS', resourceType: 'user', resourceId: newUser.id });

    return res.status(201).json({
      success: true,
      message: 'Registro de cliente completado exitosamente.',
      data: {
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
      void recordAuditEvent(req, { event: 'AUTH_LOGIN_FAILURE', result: 'denied' });
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas. Verifique su correo o contraseña.', status: 401 },
      });
    }

    const isPasswordValid = await bcrypt.compare(password, account.passwordHash);
    if (!isPasswordValid) {
      void recordAuditEvent(req, { event: 'AUTH_LOGIN_FAILURE', result: 'denied' });
      return res.status(401).json({
        success: false,
        error: { message: 'Credenciales inválidas. Verifique su correo o contraseña.', status: 401 },
      });
    }

    if (!account.user.isActive) {
      void recordAuditEvent(req, { event: 'AUTH_LOGIN_FAILURE', resourceType: 'user', resourceId: account.user.id, result: 'disabled' });
      return res.status(403).json({
        success: false,
        error: { message: 'Su cuenta se encuentra desactivada. Contacte a soporte.', status: 403 },
      });
    }

    const token = generateToken(account.user);
    setAuthCookie(res, token);
    req.user = account.user;
    void recordAuditEvent(req, { event: 'AUTH_LOGIN_SUCCESS', resourceType: 'user', resourceId: account.user.id });

    return res.json({
      success: true,
      message: 'Inicio de sesión exitoso.',
      data: {
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

function logout(req, res) {
  res.clearCookie(config.authCookie.name, {
    httpOnly: true,
    secure: config.nodeEnv === 'production',
    sameSite: 'lax',
    path: '/',
  });
  return res.json({ success: true, message: 'Sesión cerrada exitosamente.' });
}

module.exports = {
  register,
  login,
  getProfile,
  logout,
};
