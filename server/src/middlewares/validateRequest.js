const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function badRequest(res, message = 'La solicitud contiene datos inválidos.') {
  return res.status(400).json({ success: false, error: { message, status: 400 } });
}

function validatePositiveIntegerParams(...names) {
  return (req, res, next) => {
    if (names.some((name) => !/^\d+$/.test(String(req.params[name] || '')) || Number(req.params[name]) < 1)) {
      return badRequest(res, 'El identificador proporcionado no es válido.');
    }
    next();
  };
}

function validateBody({ required = [], strings = {}, emailFields = [] }) {
  return (req, res, next) => {
    if (!req.body || typeof req.body !== 'object' || Array.isArray(req.body)) return badRequest(res);
    for (const field of required) {
      if (typeof req.body[field] !== 'string' || !req.body[field].trim()) return badRequest(res);
    }
    for (const [field, limits] of Object.entries(strings)) {
      if (req.body[field] == null) continue;
      if (typeof req.body[field] !== 'string') return badRequest(res);
      req.body[field] = req.body[field].trim();
      if (req.body[field].length < (limits.min || 0) || req.body[field].length > limits.max) return badRequest(res);
    }
    for (const field of emailFields) {
      if (!EMAIL_PATTERN.test(String(req.body[field] || '')) || String(req.body[field]).length > 254) return badRequest(res);
      req.body[field] = req.body[field].toLowerCase();
    }
    next();
  };
}

const validateLogin = validateBody({
  required: ['email', 'password'],
  strings: { email: { max: 254 }, password: { min: 1, max: 128 } },
  emailFields: ['email'],
});
const validateRegister = validateBody({
  required: ['verificationCode', 'email', 'password'],
  strings: { verificationCode: { min: 8, max: 8 }, email: { max: 254 }, password: { min: 12, max: 128 } },
  emailFields: ['email'],
});
const validateContact = validateBody({
  required: ['fullName', 'email', 'phone', 'subject', 'message'],
  strings: { fullName: { max: 150 }, email: { max: 254 }, phone: { max: 30 }, subject: { max: 200 }, message: { max: 5000 } },
  emailFields: ['email'],
});
const validateAppointment = validateBody({
  required: ['fullName', 'email', 'phone', 'serviceType', 'preferredDate', 'preferredTime'],
  strings: { fullName: { max: 150 }, email: { max: 254 }, phone: { max: 30 }, serviceType: { max: 100 }, preferredDate: { max: 10 }, preferredTime: { max: 10 }, message: { max: 5000 } },
  emailFields: ['email'],
});
const validateCaseReview = validateBody({
  required: ['fullName', 'email', 'phone', 'caseType'],
  strings: { fullName: { max: 150 }, email: { max: 254 }, phone: { max: 30 }, caseType: { max: 100 }, description: { max: 5000 } },
  emailFields: ['email'],
});

module.exports = {
  validatePositiveIntegerParams,
  validateLogin,
  validateRegister,
  validateContact,
  validateAppointment,
  validateCaseReview,
};
