const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Tamaño máximo permitido por documento: 25 MB
const MAX_FILE_SIZE_MB = 25;
const MAX_FILE_SIZE_BYTES = MAX_FILE_SIZE_MB * 1024 * 1024;

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
    fileSize: MAX_FILE_SIZE_BYTES, // 25 MB por archivo
  },
});

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
      next();
    });
  };
}

module.exports = {
  single: (fieldName) => handleUploadMiddleware(rawUpload.single(fieldName)),
  array: (fieldName, maxCount) => handleUploadMiddleware(rawUpload.array(fieldName, maxCount)),
  any: () => handleUploadMiddleware(rawUpload.any()),
  MAX_FILE_SIZE_MB,
  MAX_FILE_SIZE_BYTES,
};
