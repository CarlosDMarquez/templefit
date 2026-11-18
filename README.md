# TempleFit — tienda en línea

Tienda de una sola página, sin dependencias ni compilación: abre `index.html` en el navegador.

El cliente elige color y talla, arma su carrito y envía el pedido por WhatsApp. No hay cobro en línea: el pago y la entrega se acuerdan por WhatsApp.

## Archivos

- `productos.js` — **el catálogo**: productos, precios, tallas, colores y número de WhatsApp. Es el único archivo que hay que tocar en el día a día.
- `index.html` — secciones y textos fijos (portada, cómo comprar, la marca, ubicación).
- `styles.css` — diseño. Los colores y tipografías están en el bloque `:root` del inicio.
- `script.js` — catálogo, ficha de producto, carrito y mensaje de WhatsApp.
- `img/` — fotos. Para cambiar una, reemplaza el archivo conservando el nombre:
  - `logo.png`, `favicon.png` — monograma del logo.
  - `hero.jpg`, `shorts.jpg` — fotos de la portada (en móvil solo se ve `hero.jpg`).
  - `p-*.jpg` — fotos de producto, una por color (verticales, proporción 4:5, de al menos 900 px de ancho si se puede).
  - `playeras.jpg`, `hoodies.jpg`, `shorts.jpg` — recuadros de «Compra por categoría» (se asignan en `categorias` de `productos.js`).
  - `look-1.jpg`, `look-2.jpg` y las demás de `looks` — fotos del lookbook «Así se lleva».

Cada prenda tiene su propio enlace (`index.html#p=hoodie-rayo`, con el `id` del producto) para compartirla en Facebook o WhatsApp.

## Cambios habituales (en `productos.js`)

- **Poner o cambiar un precio:** `precio: 499`. Con `precio: null` la tienda muestra «Precio por WhatsApp» y el carrito no calcula total.
- **Agregar un producto:** copia un bloque `{ ... }` de `productos`, cambia el `id` y los datos, y pon su foto en `img/`.
- **Marcar agotado:** añade `agotado: true` al producto.
- **Quitar una talla o un color:** bórralo de la lista `tallas` o `colores`.
- **Cambiar el producto de «Lo nuevo»:** pon su `id` en `destacado`.
- **Cambiar las fotos del lookbook:** lista `looks`; cada foto indica qué prenda y color abre.
- **Cambiar el WhatsApp de los pedidos:** `whatsapp` (el teléfono que se ve escrito está además en `index.html`).

## Reutilizar como plantilla para otro negocio

1. Copia la carpeta completa.
2. En `productos.js`, cambia nombre, WhatsApp, categorías y productos.
3. En `styles.css`, cambia los valores de `:root` (colores y fuentes).
4. En `index.html`, sustituye textos, teléfono (`wa.me/…` y `tel:`), correo, mapa y los datos del bloque `application/ld+json`.
5. Reemplaza las fotos de `img/`.
