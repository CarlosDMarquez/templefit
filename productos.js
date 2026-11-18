/* ==========================================================================
   CATÁLOGO — aquí se editan productos, precios, tallas y colores.
   No hace falta tocar ningún otro archivo para dar de alta o baja un producto.

   Cada producto:
     id          identificador único, sin espacios (no lo cambies una vez publicado)
     nombre      como se muestra en la tienda
     categoria   uno de los id de `categorias`
     precio      número en pesos, sin signo ni comas (ej. 499).
                 Si se deja en null, la tienda muestra «Precio por WhatsApp».
     descripcion texto corto de la ficha del producto
     tallas      lista de tallas disponibles
     colores     lista de colores; cada uno con su nombre, su tono (hex) y su foto
     etiqueta    opcional: «Nuevo», «Más vendido», «Últimas piezas»…
     agotado     opcional: true para mostrarlo sin poder agregarlo

   `destacado` es el id del producto que sale en grande en la sección «Lo nuevo».
   Cada categoría lleva la foto de su recuadro en «Compra por categoría».
   `looks` son las fotos del lookbook: cada una abre la prenda (y el color) que muestra.
   ========================================================================== */
window.TIENDA = {
  nombre: 'TempleFit',
  whatsapp: '5216866024630',
  moneda: 'MXN',

  categorias: [
    { id: 'playeras', nombre: 'Playeras', img: 'img/playeras.jpg' },
    { id: 'hoodies', nombre: 'Hoodies', img: 'img/hoodies.jpg' },
    { id: 'shorts', nombre: 'Shorts', img: 'img/shorts.jpg' }
  ],

  destacado: 'playera-compresion',

  looks: [
    { img: 'img/hero.jpg', producto: 'playera-gods-force', color: 'Negro' },
    { img: 'img/look-1.jpg', producto: 'hoodie-rayo', color: 'Arena' },
    { img: 'img/playeras.jpg', producto: 'playera-templefit', color: 'Azul' },
    { img: 'img/shorts.jpg', producto: 'shorts-rayo', color: 'Lila' },
    { img: 'img/look-2.jpg', producto: 'playera-templefit', color: 'Rosa' },
    { img: 'img/hoodies.jpg', producto: 'hoodie-rayo', color: 'Negro' }
  ],

  productos: [
    {
      id: 'playera-compresion',
      nombre: 'Playera de compresión TF',
      categoria: 'playeras',
      precio: null,
      descripcion: 'Corte ajustado al cuerpo, manga raglán y el logo TF al pecho. Hecha para entrenar sin que nada estorbe.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Negro', hex: '#111111', img: 'img/p-compresion-negro.jpg' },
        { nombre: 'Azul marino', hex: '#1b2a5c', img: 'img/p-compresion-azul-marino.jpg' },
        { nombre: 'Gris', hex: '#77777b', img: 'img/p-compresion-gris.jpg' }
      ],
      etiqueta: 'Nuevo'
    },
    {
      id: 'playera-gods-force',
      nombre: 'Playera oversize The Gods Force',
      categoria: 'playeras',
      precio: null,
      descripcion: 'Corte oversize con el estampado The Gods Force a toda la espalda.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Negro', hex: '#111111', img: 'img/p-gods-force.jpg' }
      ],
      etiqueta: 'Edición 2025'
    },
    {
      id: 'playera-templefit',
      nombre: 'Playera oversize TempleFit',
      categoria: 'playeras',
      precio: null,
      descripcion: 'Caída amplia y TempleFit en arco en la espalda. La básica de la marca, en cuatro colores.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Azul', hex: '#6f93b8', img: 'img/p-templefit-azul.jpg' },
        { nombre: 'Crema', hex: '#ece6d8', img: 'img/p-templefit-crema.jpg' },
        { nombre: 'Rosa', hex: '#f0b4d6', img: 'img/p-templefit-rosa.jpg' },
        { nombre: 'Negro', hex: '#111111', img: 'img/p-templefit-negro.jpg' }
      ]
    },
    {
      id: 'hoodie-rayo',
      nombre: 'Hoodie Rayo',
      categoria: 'hoodies',
      precio: null,
      descripcion: 'Corte holgado, rayo al pecho y TempleFit en la manga.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Negro', hex: '#111111', img: 'img/p-hoodie-negro.jpg' },
        { nombre: 'Arena', hex: '#d8b894', img: 'img/p-hoodie-arena.jpg' }
      ]
    },
    {
      id: 'playera-rayo',
      nombre: 'Playera oversize Rayo',
      categoria: 'playeras',
      precio: null,
      descripcion: 'Oversize lisa con el rayo TempleFit al pecho. Combina con todo.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Negro', hex: '#111111', img: 'img/p-rayo-negro.jpg' }
      ]
    },
    {
      id: 'shorts-rayo',
      nombre: 'Shorts Rayo',
      categoria: 'shorts',
      precio: null,
      descripcion: 'Ligeros, con el rayo TempleFit, para pierna, cardio y calle.',
      tallas: ['CH', 'M', 'G', 'XG'],
      colores: [
        { nombre: 'Lila', hex: '#c9a0e0', img: 'img/p-shorts-lila.jpg' },
        { nombre: 'Verde agua', hex: '#8fb5b3', img: 'img/p-shorts-verde.jpg' }
      ]
    }
  ]
};
