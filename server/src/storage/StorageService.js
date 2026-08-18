const LocalStorage = require('./LocalStorage');
const S3Storage = require('./S3Storage');

class StorageService {
  constructor() {
    const driver = process.env.STORAGE_DRIVER || 'local';

    if (driver === 's3') {
      console.log('[StorageService] Inicializando proveedor de almacenamiento en la Nube (S3 / Cloudflare R2)...');
      this.provider = new S3Storage();
    } else {
      console.log('[StorageService] Inicializando proveedor de almacenamiento local privado (LocalStorage)...');
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

  getFileStream(storageKey) {
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
