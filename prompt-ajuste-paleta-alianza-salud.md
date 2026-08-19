# Tarea: ajustar acentos de color para alinear identidad de marca (sin rediseñar)

## Contexto

Este proyecto es la página web de **Alianza Salud Medical Group** (una filial nueva, con público y enfoque distintos a otra filial existente). Está construido con **Tailwind CSS v4** (usa `--color-*` en `oklch`, clases como `bg-emerald-500`, `from-emerald-600`, etc.).

La filial hermana (`alianzamedical.co`) usa esta paleta de marca:

| Rol | Color | Hex |
|---|---|---|
| Primario/acento | Azul cielo | `#6EC1E4` |
| Secundario | Gris oscuro azulado | `#54595F` |
| Acento CTA | Dorado | `#FBC304` |
| Oscuro/overlay | Casi negro azulado | `#1C2426` |

Este sitio actual usa como base:
- Primario: `emerald-500/600` (verde)
- Puente existente: `teal-500/600` (ya aparece en gradientes tipo `from-emerald-600 via-emerald-500 to-teal-600`)
- Oscuros: `slate-900/800/700`
- Texto: `gray-900/600/400`

**Decisión de diseño (no negociable):** NO se va a rediseñar ni se va a reemplazar el verde `emerald` como color primario. El sitio ya está terminado, es moderno, y esa es la identidad que queremos conservar. El objetivo es únicamente **agregar puentes visuales sutiles** que conecten esta página con la marca madre, sin diluir la identidad verde ni afectar las animaciones/microinteracciones existentes.

## Qué quiero que hagas

Recorre el HTML/componentes del proyecto y aplica estos 3 ajustes puntuales, **solo donde tenga sentido visual y no compita con el verde primario**:

### 1. Refuerza `teal` como puente entre verde y azul
- Donde ya exista `from-emerald-500 to-teal-600` o similar, está bien tal cual.
- En gradientes nuevos o secundarios (no en el CTA principal ni en el hero), prefiere `teal-500/600` en vez de agregar más `emerald`, para que la paleta se sienta un poco más "fría" y cercana al azul de la marca madre.

### 2. Introduce `sky-500` (`#0ea5e9`) como acento terciario, en detalles pequeños
Úsalo en:
- Color de links de texto en `hover` (`hover:text-sky-500`), en vez de o alternando con `emerald`.
- Íconos decorativos secundarios (no los íconos de CTA principales).
- Bordes sutiles en `hover` de tarjetas informativas (`hover:border-sky-300`), donde actualmente usan `border-gray-200` o `border-emerald-200`.
- Elementos de contacto (teléfono, ubicación, redes) si existen, para diferenciarlos ligeramente del CTA verde.

**No lo uses** en botones primarios ni en el hero principal — el verde debe seguir siendo el protagonista.

### 3. Usa `amber-500` (`#f59e0b`) para badges y elementos de "destacado"
Aplícalo en:
- Badges tipo "recomendado", "destacado", "más popular", calificaciones (estrellas), o etiquetas de "nuevo".
- Si hay componentes de rating/reviews, usa `text-amber-400`/`fill-amber-400` para las estrellas.
- No lo uses en botones de acción principal (esos siguen siendo `emerald`).

### 4. No toques los `slate`
Los `slate-900/800/700` que ya usa el sitio para fondos oscuros y overlays son suficientemente cercanos al `#54595F`/`#1C2426` de la marca madre. Déjalos exactamente como están.

## Restricciones importantes

- **No cambies la tipografía, el espaciado, el layout, ni las animaciones/microinteracciones existentes.**
- **No reemplaces `emerald` como color primario** en botones CTA, hero, ni elementos de mayor jerarquía visual.
- Los cambios deben ser sutiles: acentos, hovers, badges, íconos secundarios — no repintar secciones completas.
- Si usas clases de Tailwind, respeta el sistema de tokens ya definido en el proyecto (`--color-*` en `oklch`, definido en el archivo de configuración/CSS raíz) en vez de hardcodear hex nuevos.
- Verifica que los nuevos colores (`sky`, `amber`) tengan buen contraste en modo claro y oscuro si el sitio soporta dark mode.
- Al final, dame un resumen breve de qué archivos/componentes tocaste y en qué elementos específicos aplicaste cada color nuevo.

## Resultado esperado

Un sitio que sigue sintiéndose moderno, verde y con personalidad propia, pero que al navegarlo justo después del sitio hermano (azul + dorado + oscuros neutros) se perciba como parte de la misma familia de marca gracias a los acentos en `sky` y `amber`.
