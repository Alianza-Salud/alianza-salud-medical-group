const fs = require('fs');
const path = require('path');
const { pool } = require('./db');
const storageService = require('../storage/StorageService');

async function runMigration() {
  if (!pool) {
    console.error('[Error] No se pudo establecer conexión con MySQL.');
    process.exit(1);
  }

  console.log('====================================================');
  console.log('INICIANDO MIGRACIÓN IDEMPOTENTE DE DOCUMENTOS');
  console.log('====================================================');

  const [docs] = await pool.query('SELECT * FROM documents');

  let stats = {
    total: docs.length,
    migrated: 0,
    skipped: 0,
    errors: 0,
    errorDetails: [],
  };

  for (const doc of docs) {
    try {
      // 1. Si el documento ya fue migrado y existe físicamente en StorageService, se omite
      if (doc.storage_key && (await storageService.exists(doc.storage_key))) {
        console.log(`[Omitido] ID ${doc.id} - Ya migrado a storage_key: ${doc.storage_key}`);
        stats.skipped++;
        continue;
      }

      // 2. Si tiene una ruta de archivo legado en /uploads/
      if (doc.file_path) {
        const legacyPath = doc.file_path.startsWith('/') ? doc.file_path.slice(1) : doc.file_path;
        const physicalPath = path.join(__dirname, '../../', legacyPath);

        if (!fs.existsSync(physicalPath)) {
          console.warn(`[Warning] ID ${doc.id} - El archivo legado no existe en disco: ${physicalPath}`);
          stats.errors++;
          stats.errorDetails.push({ id: doc.id, name: doc.name, reason: 'Archivo físico legado no encontrado en disco.' });
          continue;
        }

        // 3. Migrar copiando el archivo al nuevo almacenamiento privado
        const originalName = doc.original_name || doc.name || 'documento.pdf';
        const stored = await storageService.uploadFile(physicalPath, originalName);

        // 4. Actualizar metadatos en MySQL de forma segura
        await pool.query(
          `UPDATE documents SET storage_key = ?, checksum = ?, file_size = ?, status = 'ready' WHERE id = ?`,
          [stored.storageKey, stored.checksum, stored.size, doc.id]
        );

        console.log(`[Migrado] ID ${doc.id} - '${originalName}' -> ${stored.storageKey} (SHA-256: ${stored.checksum.slice(0, 12)}...)`);
        stats.migrated++;
      } else {
        // Documento documental sin archivo adjunto
        stats.skipped++;
      }
    } catch (err) {
      console.error(`[Error] ID ${doc.id} - Fallo en la migración:`, err.message);
      stats.errors++;
      stats.errorDetails.push({ id: doc.id, name: doc.name, reason: err.message });
    }
  }

  console.log('\n====================================================');
  console.log('INFORME FINAL DE MIGRACIÓN DE DOCUMENTOS');
  console.log('====================================================');
  console.log(`Total Documentos en Base de Datos : ${stats.total}`);
  console.log(`Migrados Exitosamente a Storage    : ${stats.migrated}`);
  console.log(`Omitidos (Previamente migrados)    : ${stats.skipped}`);
  console.log(`Errores o Archivos Inexistentes    : ${stats.errors}`);
  console.log('====================================================\n');

  if (stats.errorDetails.length > 0) {
    console.log('Detalle de advertencias/errores:');
    console.table(stats.errorDetails);
  }

  process.exit(0);
}

runMigration().catch((err) => {
  console.error('Error fatal al ejecutar la migración:', err);
  process.exit(1);
});
