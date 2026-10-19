# Almacenamiento privado

`STORAGE_DRIVER=local` guarda objetos bajo `storage/documents`; `STORAGE_DRIVER=s3` usa un bucket S3-compatible privado. Ninguno debe publicarse como directorio estático.

El navegador solo recibe `downloadAvailable`; `storageKey`, rutas absolutas y `filePath` legado son datos internos. La descarga autorizada es `GET /api/cases/:id/documents/:docId/download`.

Formatos admitidos: PDF, JPEG y PNG; máximo 25 MiB por archivo y 10 archivos por solicitud. Se validan extensión, MIME y magic bytes. El nombre original es metadata y la clave física se genera aleatoriamente.

`filePath` existe únicamente para migración de registros históricos. No debe escribirse para documentos nuevos. Después de migrar todos los objetos a `storageKey`, eliminar la columna en una migración nueva.

Pendiente de infraestructura: mantener el archivo en cuarentena hasta que ClamAV/servicio antimalware lo marque como seguro. Sin esa integración, no se debe afirmar que la carga está libre de malware.
