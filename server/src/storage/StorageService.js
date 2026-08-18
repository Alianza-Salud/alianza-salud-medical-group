const LocalStorage = require('./LocalStorage');

class StorageService {
  constructor() {
    const driver = process.env.STORAGE_DRIVER || 'local';

    if (driver === 'local') {
      this.provider = new LocalStorage();
    } else {
      // Futuras integraciones (S3Storage, R2Storage)
      console.warn(`[StorageService] Driver '${driver}' no soportado aún, utilizando LocalStorage fallback.`);
      this.provider = new LocalStorage();
    }
  }

  async uploadFile(tempFilePath, originalName, mimeType) {
    return this.provider.uploadFile(tempFilePath, originalName, mimeType);
  }

  async uploadBuffer(buffer, originalName, mimeType) {
    return this.provider.uploadBuffer(buffer, originalName, mimeType);
  }

  getReadStream(storageKey) {
    return this.provider.getReadStream(storageKey);
  }

  async exists(storageKey) {
    return this.provider.exists(storageKey);
  }

  async deleteFile(storageKey) {
    return this.provider.deleteFile(storageKey);
  }

  getAbsolutePath(storageKey) {
    return this.provider.getAbsolutePath(storageKey);
  }
}

module.exports = new StorageService();
