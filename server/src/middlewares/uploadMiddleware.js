const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tamaño máximo permitido por documento: 25 MB
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;
const MAX_FILES = 10;
const ALLOWED_TYPES = new Map([
  ['.pdf', 'application/pdf'],
  ['.jpg', 'image/jpeg'],
  ['.jpeg', 'image/jpeg'],
  ['.png', 'image/png'],
]);

// Crear la carpeta server/uploads/documents si no existe
const uploadDir = path.join(__dirname, '../../uploads/documents');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1e9);
    const ext = path.extname(file.originalname);
    const safeName = path.basename(file.originalname, ext).replace(/[^a-zA-Z0-9_-]/g, '_');
    cb(null, `${safeName}-${uniqueSuffix}${ext}`);
  },
});

const rawUpload = multer({
  storage: storage,
  limits: {
    fileSize: MAX_FILE_SIZE_BYTES,
    files: MAX_FILES,
  },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    const expectedMime = ALLOWED_TYPES.get(ext);
    if (!expectedMime || expectedMime !== String(file.mimetype || '').toLowerCase()) {
      return cb(new Error('Tipo de archivo no permitido. Solo se aceptan PDF, JPEG y PNG.'));
    }
    cb(null, true);
  },
});

const rawImageUpload = multer({
  storage,
  limits: { fileSize: MAX_FILE_SIZE_BYTES, files: 1 },
  fileFilter: (req, file, cb) => {
    const ext = path.extname(file.originalname || '').toLowerCase();
    if (!['.jpg', '.jpeg', '.png'].includes(ext) || !['image/jpeg', 'image/png'].includes(file.mimetype)) {
      return cb(new Error('Tipo de imagen no permitido. Solo se aceptan JPEG y PNG.'));
    }
    cb(null, true);
  },
});

function hasValidSignature(buffer, mimeType) {
  if (mimeType === 'application/pdf') return buffer.subarray(0, 5).toString('ascii') === '%PDF-';
  if (mimeType === 'image/png') return buffer.subarray(0, 8).equals(Buffer.from([0x89, 0x50, 0x4e, 0x47, 0x0d, 0x0a, 0x1a, 0x0a]));
  if (mimeType === 'image/jpeg') return buffer.length >= 3 && buffer[0] === 0xff && buffer[1] === 0xd8 && buffer[2] === 0xff;
  return false;
}

async function validateUploadedFiles(req) {
  const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();
  if (req.file) files.push(req.file);
  for (const file of files) {
    const handle = await fs.promises.open(file.path, 'r');
    try {
      const header = Buffer.alloc(8);
      const { bytesRead } = await handle.read(header, 0, header.length, 0);
      if (!hasValidSignature(header.subarray(0, bytesRead), file.mimetype)) {
        throw new Error(`El contenido real de "${path.basename(file.originalname)}" no coincide con un tipo permitido.`);
      }
    } finally {
      await handle.close();
    }
  }
}

async function cleanupUploadedFiles(req) {
  const files = Array.isArray(req.files) ? req.files : Object.values(req.files || {}).flat();
  if (req.file) files.push(req.file);
  await Promise.all(files.map((file) => fs.promises.unlink(file.path).catch(() => {})));
}

/**
 * Middleware para envolver multer y capturar errores de tamaño (LIMIT_FILE_SIZE)
 */
function handleUploadMiddleware(multerMethod) {
  return (req, res, next) => {
    multerMethod(req, res, (err) => {
      if (err) {
        if (err instanceof multer.MulterError && err.code === 'LIMIT_FILE_SIZE') {
          return res.status(400).json({
            success: false,
            error: {
              message: `Uno o más archivos exceden el tamaño máximo permitido por documento (${MAX_FILE_SIZE_MB} MB). Por favor reduzca el archivo o comprímalo.`,
              status: 400,
            },
          });
        }
        return res.status(400).json({
          success: false,
          error: { message: err.message || 'Error al procesar la subida del archivo.', status: 400 },
        });
      }
      validateUploadedFiles(req).then(next).catch(async (validationError) => {
        await cleanupUploadedFiles(req);
        res.status(400).json({ success: false, error: { message: validationError.message, status: 400 } });
      });
    });
  };
}

module.exports = {
  single: (fieldName) => handleUploadMiddleware(rawUpload.single(fieldName)),
  image: (fieldName) => handleUploadMiddleware(rawImageUpload.single(fieldName)),
  array: (fieldName, maxCount) => handleUploadMiddleware(rawUpload.array(fieldName, maxCount)),
  fields: (definitions) => handleUploadMiddleware(rawUpload.fields(definitions)),
  any: () => handleUploadMiddleware(rawUpload.any()),
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
  MAX_FILES,
  hasValidSignature,
};
