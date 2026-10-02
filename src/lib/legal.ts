import { site } from '@/lib/site';

/** Titular de la tienda (obligatorio por la LSSI, art. 10). */
export const owner = {
  name: 'Iker Segovia Moreno',
  nif: '50387466D',
  address: 'Calle Cometa, 3, 03699 Alicante (España)',
  email: site.email
};

const titular = `${owner.name}, con NIF ${owner.nif} y domicilio en ${owner.address}`;

/** Párrafos de cada página. Las líneas que empiezan por "## " se muestran como subtítulos. */
export const legalPages: Record<string, { title: string; body: string[] }> = {
  'aviso-legal': {
    title: 'Aviso legal',
    body: [
      '## Titular del sitio web',
      `En cumplimiento de la Ley 34/2002, de Servicios de la Sociedad de la Información y de Comercio Electrónico (LSSI), se informa de que este sitio web y la marca ${site.name} son titularidad de ${titular}. Correo electrónico de contacto: ${owner.email}.`,
      '## Condiciones de uso',
      'El acceso a este sitio web es gratuito e implica la aceptación de este aviso legal. El usuario se compromete a hacer un uso adecuado de los contenidos y a no emplearlos para actividades ilícitas.',
      '## Propiedad intelectual',
      `Los textos, diseños, logotipos y demás contenidos de este sitio son propiedad de ${owner.name} o se usan con autorización. Queda prohibida su reproducción sin consentimiento expreso.`,
      '## Responsabilidad',
      'El titular no se hace responsable de los daños derivados de un uso indebido del sitio ni de interrupciones del servicio ajenas a su control.',
      '## Legislación aplicable',
      'Este aviso legal se rige por la legislación española. Si eres consumidor, podrás acudir a los juzgados de tu domicilio.'
    ]
  },
  envios: {
    title: 'Envíos',
    body: [
      `Preparamos los pedidos en 24–48 h laborables. El plazo de entrega es de ${site.shippingDays} a España peninsular.`,
      `El envío es gratuito para pedidos superiores a ${site.freeShippingThreshold} €. Para importes inferiores, el coste se muestra en el checkout antes de pagar.`,
      'Recibirás un email con el número de seguimiento en cuanto tu pedido salga.'
    ]
  },
  devoluciones: {
    title: 'Devoluciones y desistimiento',
    body: [
      '## Derecho de desistimiento',
      `Como consumidor tienes derecho a desistir de tu compra en un plazo de 14 días naturales desde la recepción, sin necesidad de justificación. En ${site.name} ampliamos este plazo a ${site.returnDays} días.`,
      '## Cómo devolver un pedido',
      `Escríbenos a ${owner.email} indicando tu número de pedido y tu decisión de devolverlo. Te indicaremos la dirección de devolución. El producto debe devolverse en buen estado.`,
      '## Reembolso',
      'Te reembolsaremos el importe pagado, incluidos los gastos de envío estándar, en un máximo de 14 días desde que nos comuniques el desistimiento, usando el mismo medio de pago. Podremos retener el reembolso hasta recibir el producto. Los gastos de devolución corren a cargo del cliente salvo que el producto sea defectuoso o erróneo.',
      '## Garantía',
      'Los productos cuentan con la garantía legal de conformidad de 3 años prevista en el Real Decreto Legislativo 1/2007 (Ley General para la Defensa de los Consumidores y Usuarios).'
    ]
  },
  contacto: {
    title: 'Contacto',
    body: [
      `Escríbenos a ${owner.email}. Respondemos en menos de 24 h laborables.`,
      `Titular: ${owner.name} · NIF ${owner.nif} · ${owner.address}.`
    ]
  },
  privacidad: {
    title: 'Política de privacidad',
    body: [
      '## Responsable del tratamiento',
      `${titular}. Contacto: ${owner.email}.`,
      '## Qué datos tratamos y para qué',
      'Tratamos los datos que nos facilitas al comprar (nombre, dirección, email, teléfono) para gestionar tu pedido, el envío, la facturación y la atención al cliente. Si dejas una reseña, publicamos el nombre y la ciudad que indiques. Si lo autorizas expresamente, te enviaremos comunicaciones comerciales.',
      '## Base legal',
      'La ejecución del contrato de compraventa, el cumplimiento de obligaciones legales (fiscales y de consumo) y, para las comunicaciones comerciales y reseñas, tu consentimiento, que puedes retirar en cualquier momento.',
      '## Conservación',
      'Conservamos los datos mientras dure la relación comercial y, después, durante los plazos legales exigidos (por ejemplo, 6 años para la documentación contable).',
      '## Destinatarios',
      'Los pagos y pedidos se gestionan a través de Shopify, y los envíos a través de empresas de transporte, que actúan como encargados del tratamiento. No almacenamos datos de tarjeta. Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo con las garantías adecuadas (cláusulas contractuales tipo).',
      '## Tus derechos',
      `Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación y portabilidad escribiendo a ${owner.email}. Si consideras que no hemos atendido correctamente tu solicitud, puedes reclamar ante la Agencia Española de Protección de Datos (www.aepd.es).`
    ]
  },
  terminos: {
    title: 'Condiciones de venta',
    body: [
      '## Vendedor',
      `Las ventas de este sitio las realiza ${titular}.`,
      '## Precios y pago',
      'Los precios se muestran en euros e incluyen IVA. Los gastos de envío, si los hay, se indican antes de finalizar la compra. El pago se realiza a través del checkout seguro de Shopify.',
      '## Proceso de compra',
      'El contrato se formaliza al completar el pago. Recibirás un email de confirmación con el resumen de tu pedido. Nos reservamos el derecho a cancelar pedidos en caso de error manifiesto en el precio, informándote previamente y reembolsando cualquier importe cobrado.',
      '## Envío, devoluciones y garantía',
      'Consulta las páginas de Envíos y Devoluciones y desistimiento.',
      '## Legislación aplicable',
      'Estas condiciones se rigen por la legislación española. Si eres consumidor, podrás acudir a los juzgados de tu domicilio.'
    ]
  }
};
