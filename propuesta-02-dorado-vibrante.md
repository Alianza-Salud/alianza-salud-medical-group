# Propuesta visual 2 — Dorado vibrante / juvenil

## Concepto

Un dorado brillante y energético, combinado con coral y turquesa, sobre fondos claros y formas muy redondeadas. Transmite **agilidad, cercanía y modernidad** — el tipo de estética que usan las apps de salud digital orientadas a un público joven/millennial (telemedicina, agendamiento rápido, chat con especialistas).

**Ideal para:** un público más joven, digital-first, que busca rapidez y conveniencia (agendar en minutos, videoconsulta, chat), no necesariamente el tono "boutique" de la propuesta 1.

## Paleta

| Rol | Color | Hex |
|---|---|---|
| Primario | Dorado vibrante | `#FFB700` |
| Primario claro (fondos, hover suave) | Dorado suave | `#FFD166` |
| Acento energía (urgencia positiva, badges) | Coral | `#FF6B57` |
| Acento fresco (secundario, botones alternos) | Turquesa | `#2DD4BF` |
| Acento puente (conexión con marca madre) | Celeste | `#38BDF8` |
| Texto / oscuro | Gris carbón | `#1F2937` |
| Fondo | Blanco cálido | `#FFFDF7` |

## Variables CSS

```css
:root {
  --color-primary: #FFB700;
  --color-primary-light: #FFD166;
  --color-energy: #FF6B57;
  --color-fresh: #2DD4BF;
  --color-accent: #38BDF8;
  --color-text: #1F2937;
  --color-bg: #FFFDF7;
}
```

## Cómo se aplica

- **Botón principal (CTA):** fondo `--color-primary`, texto oscuro (`--color-text`) para buen contraste, **radio de esquina tipo píldora** (999px) — refuerza lo juvenil/ágil.
- **Botón secundario:** fondo `--color-fresh` al 10% de opacidad, texto en turquesa oscuro.
- **Badges de urgencia positiva** ("cupos hoy", "disponible ahora"): fondo coral al 10%, texto en `--color-energy`, con ícono/emoji si el tono de marca lo permite.
- **Navegación / chip de contacto:** fondo sólido en `--color-accent` (celeste), texto blanco, forma de píldora.
- **Tarjetas destacadas (ej. perfil de especialista):** gradiente diagonal `--color-primary` → `--color-energy`, texto blanco.
- **Tipografía:** pesos más audaces (700–800) en títulos, para reforzar la energía.
- **Fondo general:** blanco cálido, nunca gris — mantiene la sensación ligera/rápida.

## Por qué funciona

- Los tonos cálidos (dorado + coral) generan sensación de inmediatez sin caer en alarmismo, ideal para mensajes tipo "agenda hoy" o "disponible ahora".
- El turquesa y celeste bajan la temperatura visual y aportan la sensación "fresca/confiable" que necesita un sitio de salud, evitando que se vea como una app de comida rápida.
- Las formas de píldora y los pesos tipográficos audaces son lenguaje visual típico de apps digital-first, lo que ayuda a posicionar esta filial como más moderna/accesible frente al público joven.
- El celeste como acento puente mantiene, igual que en la propuesta 1, una conexión sutil con la paleta de la marca madre.
