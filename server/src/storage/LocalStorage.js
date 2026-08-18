const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

class LocalStorage {
  constructor(baseDir) {
    this.baseDir = baseDir || path.join(__dirname, '../../../storage/documents');
    this.ensureDirectory(this.baseDir);
  }

  ensureDirectory(dirPath) {
    if (!fs.existsSync(dirPath)) {
      fs.mkdirSync(dirPath, { recursive: true });
    }
  }

  generateStorageKey(originalName) {
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');
    const ext = path.extname(originalName) || '';
    const randomHex = crypto.randomBytes(12).toString('hex');
    const safeBase = path.basename(originalName, ext).replace(/[^a-zA-Z0-9_-]/g, '_');

    return `documents/${year}/${month}/${Date.now()}_${randomHex}_${safeBase}${ext}`;
  }

  getAbsolutePath(storageKey) {
    // Evitar transversión de directorios (Path Traversal Protection)
    const normalizedKey = path.normalize(storageKey).replace(/^(\.\.[\/\\])+/, '');
    return path.join(this.baseDir, normalizedKey);
  }

  async calculateChecksum(filePath) {
    return new Promise((resolve, reject) => {
      const hash = crypto.createHash('sha256');
      const stream = fs.createReadStream(filePath);

      stream.on('data', (data) => hash.update(data));
      stream.on('end', () => resolve(hash.digest('hex')));
      stream.on('error', (err) => reject(err));
    });
  }

  /**
   * Almacena un archivo proveniente de una ruta temporal (ej. multer disk storage)
   */
  async uploadFile(tempFilePath, originalName) {
    const storageKey = this.generateStorageKey(originalName);
    const destinationPath = this.getAbsolutePath(storageKey);
    this.ensureDirectory(path.dirname(destinationPath));

    await fs.promises.copyFile(tempFilePath, destinationPath);

    const stats = await fs.promises.stat(destinationPath);
    const checksum = await this.calculateChecksum(destinationPath);

    return {
      storageKey,
      checksum,
      size: stats.size,
      absolutePath: destinationPath,
    };
  }

  /**
   * Almacena un buffer directamente
   */
  async uploadBuffer(buffer, originalName) {
    const storageKey = this.generateStorageKey(originalName);
    const destinationPath = this.getAbsolutePath(storageKey);
    this.ensureDirectory(path.dirname(destinationPath));

    await fs.promises.writeFile(destinationPath, buffer);

    const checksum = crypto.createHash('sha256').update(buffer).digest('hex');

    return {
      storageKey,
      checksum,
      size: buffer.length,
      absolutePath: destinationPath,
    };
  }

  getReadStream(storageKey) {
    const filePath = this.getAbsolutePath(storageKey);
    if (!fs.existsSync(filePath)) {
      throw new Error(`[LocalStorage] El archivo no existe en la ruta: ${filePath}`);
    }
    return fs.createReadStream(filePath);
  }

  async exists(storageKey) {
    const filePath = this.getAbsolutePath(storageKey);
    return fs.existsSync(filePath);
  }

  async deleteFile(storageKey) {
    const filePath = this.getAbsolutePath(storageKey);
    if (fs.existsSync(filePath)) {
      await fs.promises.unlink(filePath);
      return true;
    }
    return false;
  }
}

module.exports = LocalStorage;
