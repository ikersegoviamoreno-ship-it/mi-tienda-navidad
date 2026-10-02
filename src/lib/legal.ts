import { site } from '@/lib/site';

/** Textos base. Revísalos con tus datos fiscales reales (razón social, NIF, dirección) antes de publicar. */
export const legalPages: Record<string, { title: string; body: string[] }> = {
  envios: {
    title: 'Envíos',
    body: [
      `Preparamos los pedidos en 24–48 h laborables. El plazo de entrega es de ${site.shippingDays} a España peninsular.`,
      `El envío es gratuito para pedidos superiores a ${site.freeShippingThreshold} €. Para importes inferiores, el coste se muestra en el checkout antes de pagar.`,
      'Recibirás un email con el número de seguimiento en cuanto tu pedido salga.'
    ]
  },
  devoluciones: {
    title: 'Devoluciones',
    body: [
      `Dispones de ${site.returnDays} días naturales desde la recepción para devolver tu pedido.`,
      `Escríbenos a ${site.email} con tu número de pedido y te indicaremos los pasos. El reembolso se realiza en el mismo método de pago en un máximo de 14 días tras recibir el artículo.`
    ]
  },
  contacto: {
    title: 'Contacto',
    body: [`Escríbenos a ${site.email}. Respondemos en menos de 24 h laborables.`]
  },
  privacidad: {
    title: 'Política de privacidad',
    body: [
      'Tratamos tus datos únicamente para gestionar tu pedido y, si lo autorizas, enviarte comunicaciones comerciales.',
      'Los pagos se procesan a través del checkout seguro de Shopify; no almacenamos datos de tarjeta.',
      `Puedes ejercer tus derechos de acceso, rectificación y supresión escribiendo a ${site.email}.`
    ]
  },
  terminos: {
    title: 'Términos y condiciones',
    body: [
      'Los precios incluyen IVA. La compra se formaliza al completar el pago en el checkout.',
      'Nos reservamos el derecho a cancelar pedidos en caso de error manifiesto en el precio, informándote previamente.'
    ]
  }
};
