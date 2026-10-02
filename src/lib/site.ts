/**
 * Configuración y contenidos de la marca. Edita aquí textos, umbrales y fechas
 * sin tocar componentes.
 */
export const site = {
  name: 'Reno Aura',
  tagline: 'La Navidad, con un poco de actitud.',
  description:
    'Reno Aura: el reno navideño con actitud que saca los dedos. Decoración navideña minimalista y con humor. Envío rápido a España.',
  url: process.env.NEXT_PUBLIC_SITE_URL || 'https://renoaura.com',
  heroHandle: process.env.NEXT_PUBLIC_HERO_PRODUCT_HANDLE || 'reno-aura',
  email: 'hola@renoaura.com',
  currency: 'EUR',
  /** Envío gratis a partir de este importe (empuja hacia el Pack 2) */
  freeShippingThreshold: 40,
  /** Último día para pedir y recibir antes de Nochebuena (ajústalo a tu proveedor) */
  christmasCutoff: '2026-12-12T23:59:59+01:00',
  shippingDays: '5–9 días laborables',
  returnDays: 30
};

export const announcements = [
  'Envío GRATIS a partir de 40 €',
  'Pide antes del 12 de diciembre y llega antes de Nochebuena',
  `${site.returnDays} días de devolución sin preguntas`
];

export const benefits = [
  {
    title: 'El regalo que nadie olvida',
    text: 'Para el amigo invisible, la cena de empresa o ese cuñado que lo tiene todo. Risas garantizadas al abrirlo.'
  },
  {
    title: 'Diseño que sí combina',
    text: 'Líneas limpias y acabado cuidado: queda bien en el salón, la estantería o el escritorio. Humor, pero con estilo.'
  },
  {
    title: 'Luz cálida que crea ambiente',
    text: 'Se ilumina con un brillo cálido y suave: perfecto como luz nocturna en la mesilla, el salón o la mesa de Nochebuena.'
  },
  {
    title: 'Listo en segundos',
    text: 'Sin montaje: pon las pilas, enciéndelo y colócalo donde quieras. Ligero y fácil de mover.'
  }
];

export const useCases = [
  { label: 'Amigo invisible', emoji: '🎁' },
  { label: 'Oficina', emoji: '💼' },
  { label: 'Salón', emoji: '🛋️' },
  { label: 'Luz nocturna', emoji: '🌙' }
];

export const faqs = [
  {
    q: '¿Cuándo llega mi pedido?',
    a: `Preparamos tu pedido en 24–48 h y el envío tarda ${site.shippingDays}. Si pides antes del 12 de diciembre, lo recibes antes de Nochebuena.`
  },
  {
    q: '¿Cuánto cuesta el envío?',
    a: `El envío es gratuito en pedidos superiores a ${site.freeShippingThreshold} €. Para importes menores verás el coste exacto en el checkout antes de pagar.`
  },
  {
    q: '¿Y si no me convence?',
    a: `Tienes ${site.returnDays} días para devolverlo. Escríbenos a ${site.email} y te ayudamos sin preguntas.`
  },
  {
    q: '¿Cómo se ilumina? ¿Lleva pilas?',
    a: 'Es una figura con luz LED de tono cálido. Funciona con pilas, que no van incluidas: así llega ligero y seguro en el envío.'
  },
  {
    q: '¿Es apto para exterior?',
    a: 'Está pensado para interior. Es de plástico ligero: colócalo en estanterías, mesillas, escritorios o recibidores.'
  },
  {
    q: '¿Es apto para niños?',
    a: 'Es un objeto decorativo con humor adulto, recomendado a partir de 14 años.'
  },
  {
    q: '¿Puedo enviarlo directamente como regalo?',
    a: 'Sí. Indica la dirección de la persona en el checkout: no incluimos el precio en el paquete.'
  },
  {
    q: '¿Qué métodos de pago aceptáis?',
    a: 'Tarjeta, Apple Pay, Google Pay, PayPal y Shop Pay a través del checkout seguro de Shopify.'
  }
];

/**
 * Reseñas: añade SOLO reseñas reales de clientes (la normativa europea de consumo
 * prohíbe reseñas inventadas). Mientras esté vacío, la sección no se muestra.
 * Alternativa recomendada: integrar Judge.me / Shopify Product Reviews vía metafields.
 */
export const reviews: { name: string; city?: string; rating: number; text: string }[] = [];
