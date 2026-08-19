# Propuesta visual 1 — Dorado editorial / premium

## Concepto

Toma el dorado de marca de Alianza Medical (`#FBC304`) y lo lleva a un tono más **profundo y editorial**, en vez del amarillo plano tipo "botón de alerta". Se combina con un fondo marfil cálido y un navy casi negro para lograr una sensación de **confianza y exclusividad clínica**, sin perder calidez.

**Ideal para:** un público que valora atención personalizada, servicio premium, especialistas certificados — un tono más "boutique médico" que "app de salud masiva".

## Paleta

| Rol | Color | Hex |
|---|---|---|
| Primario | Dorado profundo | `#C9932B` |
| Primario claro (hover suave / fondos) | Dorado claro | `#E6B94D` |
| Primario oscuro (hover botones) | Dorado oscuro | `#9C7318` |
| Secundario | Navy casi negro | `#16232E` |
| Acento puente (conexión con marca madre) | Azul grisáceo | `#5A9BC4` |
| Fondo | Marfil cálido | `#FAF7F0` |
| Texto | Gris pizarra | `#3F444B` |

## Variables CSS

```css
:root {
  --color-primary: #C9932B;
  --color-primary-light: #E6B94D;
  --color-primary-dark: #9C7318;
  --color-secondary: #16232E;
  --color-accent: #5A9BC4;
  --color-bg: #FAF7F0;
  --color-text: #3F444B;
}
```

## Cómo se aplica

- **Botón principal (CTA):** fondo `--color-primary`, texto blanco, sin bordes, radio de esquina moderado (8px).
- **Botón secundario:** transparente, borde sutil en tono neutro cálido (`#d8d2c2`), texto en `--color-secondary`.
- **Tarjetas / paneles destacados:** fondo `--color-secondary` (navy), texto blanco, con el acento `--color-accent` en avatares o íconos.
- **Badges / etiquetas:** fondo dorado al 10% de opacidad, texto en `--color-primary-dark`.
- **Calificaciones / estrellas:** `--color-primary-light`.
- **Links y elementos interactivos secundarios:** `--color-accent` (azul), para mantener el hilo visual con la filial hermana.
- **Fondo general:** `--color-bg` en vez de blanco puro — evita que el dorado se vea "chillón" sobre blanco frío.

## Por qué funciona

- El dorado profundo transmite calidad/exclusividad en vez de urgencia (que es la lectura típica de amarillos brillantes en salud).
- El fondo marfil cálido hace que la paleta se sienta cohesiva y "de una sola pieza", no como colores sueltos.
- El acento azul mantiene una conexión sutil con la identidad de marca del grupo (Alianza Medical), sin copiar su paleta.
