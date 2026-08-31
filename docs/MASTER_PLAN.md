# Plan Maestro de Mejora Integral: Se7en Studios (World-Class Tier)

Un plan exhaustivo, de máxima calidad técnica y visual, diseñado para posicionar a **Se7en Studios** al nivel de los estudios y startups digitales más prestigiosos del mundo (*Linear, Vercel, Raycast, Stripe, Metalab, Basement Studio*).

---

## 🏛️ Visión & Filosofía de Marca

Transformar Se7en Studios en un **estudio boutique de software de élite y craft digital**, donde convergen tres atributos clave:
1. **Sobriedad & Lujo Digital (*Quiet Luxury*)**: Diseño oscuro de alto contraste, tipografía milimétrica, micro-texturas sutiles y ausencia total de saturación o ruido innecesario.
2. **Ingeniería de Grado Startup**: Next.js 16, React 19 Server Components, Edge CDN, PostgreSQL con RLS y cero deuda técnica.
3. **Conversión y Negocio**: Flujos sin fricción para que fundadores y empresas contraten servicios, coticen y agenden llamadas en segundos.

---

## 🌟 Pilares del Plan Maestro

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                       SE7EN STUDIOS — MASTER FRAMEWORK                      │
├───────────────────┬───────────────────┬──────────────────┬──────────────────┤
│ 1. CRAFT & UI     │ 2. MOTION & SENSE │ 3. CASOS DE WORK │ 4. CONVERSIÓN    │
│ • Tokens OLED/Dark│ • 60 FPS Springs  │ • Hover Videos   │ • Cotizador Live │
│ • Typo Masterclass│ • Sound FX Engine │ • Hotspot Lab    │ • Booking Modal  │
│ • Ambient Mesh    │ • View Transitions│ • Métricas Reales│ • WhatsApp Deep  │
├───────────────────┴───────────────────┴──────────────────┴──────────────────┤
│ 5. RADAR TÉCNICO & ARQUITECTURA      │ 6. SEO GLOBAL & EDGE PERFORMANCE     │
│ • Server Components & Actions        │ • 100/100 Core Web Vitals            │
│ • Blueprint Interactivo              │ • Schema.org & Dynamic OpenGraph     │
└──────────────────────────────────────┴──────────────────────────────────────┘
```

---

## 💎 Pilar 1: Dirección de Arte, Estética & Design System

### 1.1 Paleta de Color & Tokens de Contraste
- **Fondo Base**: `#070709` (Negro profundo OLED sin artefactos).
- **Superficies & Tarjetas**: Gradientes sutiles de `hsl(240 5% 7%)` a `hsl(240 5% 4%)` con bordes `rgba(255, 255, 255, 0.08)`.
- **Acento Primario**: `Ember Orange` (`#FF4D2E` / `hsl(9, 100%, 59%)`), utilizado exclusivamente como foco de atención y energía.
- **Micro-Textura**: Filtro SVG noise sutil compositado por hardware (1.5% de opacidad) que elimina el banding de gradientes en pantallas de alta resolución.

### 1.2 Jerarquía Tipográfica
- **Display Headlines**: Tipografía sans-serif editorial de corte moderno con `letter-spacing: -0.04em` y `leading: 1.05`.
- **Mono / Labels**: Geist Mono / JetBrains Mono para etiquetas de ingeniería, tiempos, badges y datos técnicos con `uppercase` y `tracking-widest`.
- **Lectura & Copywriting**: Inter / Geist Sans con escala fluida `clamp()` optimizada para legibilidad en cualquier dispositivo.

---

## ⚡ Pilar 2: Motion Craft, Micro-Interacciones & Experiencia Sensorial

### 2.1 Física de Movimiento a 60 FPS
- **Lenis Smooth Scroll**: Scroll inercial suave con soporte para mouse wheels, trackpads y dispositivos móviles.
- **Framer Motion Springs**: Curvas elásticas consistentes (`ease: [0.16, 1, 0.3, 1]` y `stiffness: 300, damping: 25`).
- **Spotlights Reactivos**: Iluminación radial que sigue el cursor en tarjetas de proyecto sin provocar re-renders del DOM.

### 2.2 Motor de Efectos de Sonido (*Sound FX Engine*)
- Micro-sonidos sintéticos sutiles (Web Audio API sintetizada, 0 KB de archivos externos):
  - *Click*: 1200Hz tick de alta frecuencia.
  - *Switch / Toggle*: Micro-sweep tonal.
  - *Success / Copy*: Acorde armónico ascendente.
  - *Pop / Hover*: Pulso sutil de 400Hz.
  - Control de volumen persistente con detección de `prefers-reduced-motion`.

### 2.3 View Transitions Nativas
- Transiciones fluidas entre la página principal y los casos de estudio (`/work/[slug]`) utilizando la API de View Transitions de los navegadores modernos para morphear imágenes y títulos sin saltos visuales.

---

## 📂 Pilar 3: Experiencia de Casos de Estudio & Portafolio de Élite

### 3.1 Tarjetas de Proyecto de Alto Craft
- Reproducción de video MP4/WebM en hover con precarga inteligente diferida.
- Badges de impacto cuantitativo (*"+120% conversión"*, *"NASA FIRMS Satelital"*, *"0 fricción técnica"*).
- Micro-labels de año, categoría y número de caso.

### 3.2 Simulador Interactivo de Viewports (Device Lab)
- Vista en **MacBook Pro** y **iPhone 16 Pro** en la página de proyectos `/work`.
- Hotspots interactivos con anotaciones técnicas sobre arquitectura, rendimiento y stack.

### 3.3 Casos de Estudio Profundos (`/work/[slug]`)
- Estructura editorial: Desafío de negocio → Enfoque de diseño → Arquitectura de software → Métricas de impacto.
- Galería cinemática con zoom interactivo y videos de navegación.

---

## 🎯 Pilar 4: Motor de Conversión & Lead Engine

### 4.1 Cotizador Interactivo de Proyectos (`/pricing`)
- Selector de tipo de producto (SaaS, E-Commerce, Sitio Corporativo, Software a Medida, Modernización).
- Selección modular de funcionalidades (Auth, Pagos, Motion, IA, Multi-idioma).
- Selector de velocidad (Sprint Estándar vs Sprint Exprés con dedicación prioritaria).
- Conversión inmediata a WhatsApp con mensaje prearmado y botón de copiado de cotización.

### 4.2 Modal de Booking Directo (Llamada de 15 Minutos)
- Integración fluida activable mediante evento global `open-booking-modal` y atajo `⌘K / Ctrl+K`.
- Reserva directa de llamada de descubrimiento con los 2 fundadores.

### 4.3 Indicadores de Disponibilidad en Tiempo Real
- Badge dinámico con el mes en curso y cupos abiertos (*"Marzo: 2 cupos abiertos"*).
- Indicador de pulso verde en tiempo real que comunica escasez y urgencia legítima.

---

## 🛠️ Pilar 5: Arquitectura Técnica & Edge Infra

### 5.1 Next.js 16 + React 19 Stack
- **Server Components**: Cero JavaScript del lado del cliente para contenido estático.
- **Server Actions**: Mutaciones tipadas de punta a punta validadas con esquemas estrictos.
- **Supabase PostgreSQL**: Persistencia con Row-Level Security (RLS) y sincronización en tiempo real.

### 5.2 Optimización de Core Web Vitals (100/100)
- Imágenes servidas en formato AVIF con `sizes` calculados exactamente para evitar descargas innecesarias.
- Fuentes precargadas localmente con `font-display: swap` y cero Layout Shift (CLS: 0.00).
- Despliegue global perimetral en Vercel Edge con TTFB < 40ms en toda la región.

---

## 🗺️ Roadmap de Ejecución Sugerido

### 🔹 Fase 1: Consolidación Visual & Polish Sobrio (Completada)
- [x] Reestructuración compacta de la landing page (reducción a 8 módulos clave de alto impacto).
- [x] Limpieza de categorías en Navbar, Work y Cotizador hacia un tono B2B formal.
- [x] Optimización de micro-animaciones en HeroShowcase y CategoryFilter.

### 🔹 Fase 2: Profundización de Casos de Estudio & Páginas Satélite (Siguiente paso)
- [ ] Refinar las páginas de casos de estudio individuales (`/work/[slug]`) con layout editorial de alta fidelidad.
- [ ] Enriquecer la página de radar tecnológico (`/tech`) con benchmarks interactivos.
- [ ] Optimizar el configurador interactivo en `/pricing` con selector de divisa USD/ARS en tiempo real.

### 🔹 Fase 3: Experiencia Sensorial & Micro-Detalles
- [ ] Perfeccionar las animaciones de entrada con stagger y scroll reveal sutil.
- [ ] Expandir los atajos de teclado del Command Palette (`⌘K`) para navegación rápida.
- [ ] Auditoría exhaustiva de accesibilidad WCAG AAA y contrastes en modo oscuro.

### 🔹 Fase 4: Rendimiento Extremo & SEO Global
- [ ] Implementar generación dinámica de imágenes OpenGraph para redes sociales (`/api/og`).
- [ ] Inyección de Schema.org JSON-LD para Google Search Console en todos los casos de estudio.
- [ ] Auditoría final de Core Web Vitals en dispositivos móviles de gama media y alta.
