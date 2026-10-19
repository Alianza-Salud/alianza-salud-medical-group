# Matriz RBAC

La autorización se aplica en el backend. `client` es el identificador canónico; `cliente` debe considerarse legado solo en el frontend.

| Recurso / acción | admin | auxiliar_admisiones | lawyer | client |
|---|---:|---:|---:|---:|
| Casos: listar | Todos | Todos | Solo asignados por `lawyers.user_id` | Propios por `cases.user_id` |
| Casos: ver detalle | Sí | Sí | Solo asignados | Solo propios |
| Casos: crear | Sí | Sí | Sí (regla heredada, pendiente de confirmar) | No |
| Casos: etapa/novedad/documento | Sí | Sí | Solo asignados | No |
| Casos: asignar abogados | Sí | Sí | No | No |
| Documentos: listar/descargar | Sí | Sí | Solo casos asignados | Propios y `visible_to_client=1` |
| Documento: cambiar visibilidad | Sí | Sí | Solo casos asignados | No |
| Clientes: administrar | Sí | Sí | Sí (regla heredada, pendiente de confirmar) | No |
| Abogados: listar | Sí | Sí | Sí | No |
| Abogados: administrar | Sí | No | No | No |
| Usuarios: administrar | Sí | No | No | No |
| Notificaciones: configurar/reintentar | Sí | Sí | No | No |

La regla restrictiva para abogados es que solo pueden leer o modificar casos con una relación vigente en `case_lawyers` y un registro `lawyers.user_id` activo.
