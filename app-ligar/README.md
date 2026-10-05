# Chispa — app móvil para ligar (con respeto)

App web progresiva (PWA) independiente de la tienda. Se instala en el móvil desde el navegador y funciona sin conexión. No necesita servidor propio, base de datos ni dependencias: es HTML, CSS y JavaScript.

## Secciones

| Pestaña | Qué hace |
|---|---|
| **Hoy** | Consejo del día, reto diario (con contador de retos hechos) y frase del día. |
| **Frases** | Rompehielos por categoría (apps de citas, en persona, divertidas, profundas, retomar chat), con el porqué de cada uno. Copiar y guardar favoritas. |
| **Citas** | Ideas de cita filtrables por presupuesto, momento del día y si sirven para una primera cita. |
| **Bio** | Revisor de la bio de tu perfil: puntuación de 1 a 10 y sugerencias (longitud, tópicos, tono negativo, preguntas, detalles concretos, emojis). Se analiza en el móvil, sin enviar nada. |
| **Guía** | Primera cita, señales de interés, consentimiento, red flags, seguridad en citas de apps y cómo encajar un rechazo. |

Favoritos, filtros, bio y retos se guardan en el propio móvil (`localStorage`).

## Probarla en local

```bash
cd app-ligar
npx serve .            # o: python3 -m http.server 8080
```

Abre la URL en el móvil (misma red Wi‑Fi) o en el modo móvil del navegador.

## Instalarla en el móvil

1. Publica la carpeta `app-ligar/` en cualquier hosting estático con HTTPS (Vercel, Netlify, GitHub Pages…).
2. Abre la URL en el móvil:
   - **Android (Chrome):** menú ⋮ → *Instalar aplicación*.
   - **iPhone (Safari):** Compartir → *Añadir a pantalla de inicio*.

## Archivos

- `index.html` — toda la app (contenido, estilos y lógica).
- `manifest.webmanifest` — nombre, colores e icono para instalarla.
- `sw.js` — service worker para uso sin conexión.
- `icon.svg` — icono.

Para añadir frases, ideas de cita o consejos, edita los arrays `OPENERS`, `DATES`, `TIPS` y `CHALLENGES` al principio del `<script>` de `index.html`.
