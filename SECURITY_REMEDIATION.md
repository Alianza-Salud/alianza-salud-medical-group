# Remediación de seguridad

## Acciones ya aplicadas al código

- Los directorios `server/uploads/` y `storage/` están ignorados y se retiraron del índice de Git.
- `/uploads` responde siempre 404; las descargas privadas usan endpoints autenticados.
- El acceso a casos y documentos se valida en el backend por rol, propiedad y asignación.
- JWT exige un secreto de al menos 32 caracteres, usa HS256 explícitamente y se entrega en cookie HttpOnly.
- Hay límites de abuso, CORS explícito, límites de payload y validación de contenido de archivos.

## Limpieza obligatoria del historial (acción humana)

No ejecutar estos comandos hasta tener un respaldo verificado y una ventana de coordinación. La reescritura cambia los hashes de todos los commits y requiere que cada colaborador vuelva a clonar.

```bash
git clone --mirror <URL_DEL_REPOSITORIO> alianza-salud-clean.git
cd alianza-salud-clean.git
git filter-repo --path server/uploads --path storage --path usuarios.txt --path cftunnel.exe --invert-paths
git fsck --full
git push --force --all
git push --force --tags
```

Antes y después de la limpieza:

1. Poner temporalmente el repositorio en privado.
2. Conservar un respaldo cifrado con acceso restringido solo durante la respuesta al incidente.
3. Revisar forks, clones conocidos, releases, artefactos y cachés de Actions.
4. Tratar la exposición como incidente de privacidad y escalar a responsables legales/compliance.
5. Asumir que cualquier dato publicado pudo ser copiado.
6. Rotar `JWT_SECRET`, contraseña MySQL, credenciales S3/R2, Google OAuth y cualquier secreto histórico.
7. Activar secret scanning y push protection en el proveedor Git.

Verificación posterior:

```bash
git ls-files server/uploads storage usuarios.txt cftunnel.exe
git log --all -- server/uploads storage usuarios.txt cftunnel.exe
```

Ambos comandos deben quedar sin resultados relevantes después de la limpieza completa.

## Acciones de infraestructura pendientes

- Configurar `CORS_ORIGIN` con los dominios exactos de producción.
- Establecer `TRUST_PROXY=true` solo si existe exactamente un proxy/CDN confiable delante de Express.
- Generar el secreto con `openssl rand -base64 48`; nunca reutilizar el placeholder.
- Mantener el bucket privado y conceder permisos mínimos a la identidad de la aplicación.
- Integrar ClamAV o un servicio antimalware. La validación actual cierra spoofing básico, pero no detecta malware dentro de PDF/imágenes.
- Usar un almacén compartido (Redis) para rate limiting cuando haya más de una instancia.
- Aplicar y respaldar las migraciones antes de desplegar una versión que dependa de ellas.

## Checklist de despliegue

- [ ] Historial reescrito y colaboradores coordinados
- [ ] Secretos y credenciales rotados
- [ ] `NODE_ENV=production` y HTTPS obligatorio
- [ ] `CORS_ORIGIN` explícito
- [ ] `/uploads` devuelve 404
- [ ] Bucket privado y backups MySQL probados
- [ ] Suite de seguridad y CI en verde
- [ ] Integración antimalware habilitada
- [ ] Logs revisados para evitar PII y secretos
