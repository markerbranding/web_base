const client = require('../utils/sanityClient');
const processImages = require('../utils/imageProcessor');

async function processContent(item) {
  for (const key in item) {
    if (item[key] && typeof item[key] === 'object') {
      if (item[key].media && item[key].media.url) {
        // Procesar como imagen
        item[key] = await processImages({
          url: item[key].media.url,
          alt: item[key].alt ? item[key].alt.altText : ''
        });
      } else if (isPortableTextBlock(item[key])) {
        // Procesar como Portable Text si es un block o un array que contiene blocks
        item[key] = renderBlocks(item[key]);
      } else {
        // Llamada recursiva para propiedades de objetos anidados
        await processContent(item[key]);
      }
    }
  }
}

function renderBlocks(blocks) {
  return blocks.map(block => {
    if (block._type === 'block') {
      return `<p>${block.children.map(child => child.text).join('')}</p>`;
    } else if (block._type === 'image') {
      // Asegurarse de que el objeto image y la url estén definidos antes de intentar acceder a ellos
      if (!block.image || !block.image.url) {
        console.log('Imagen no encontrada o datos de imagen incompletos:', block);
        return ''; // Devolver una cadena vacía si no hay imagen válida
      }
      const url = block.image.url;
      const alt = block.image.alt || 'Descripción no disponible';
      return `<img src="${url}" alt="${alt}">`;
    }
    return `<div>Unrecognized block type: ${block._type}</div>`; // Manejo de bloques no reconocidos
  }).join('');
}

function isPortableTextBlock(value) {
  // Verificar si es un bloque único o un array de bloques
  if (Array.isArray(value)) {
    return value.some(subItem => subItem._type && (subItem._type === 'block' || subItem._type === 'image'));
  }
  return value._type && (value._type === 'block' || value._type === 'image');
}

module.exports = async function() {
  const data = await client.fetch(`*[_type == "products"]{
    titleseo,
    descseo,
    title,
    slug,
    publishedAt,
    "categories": categories[]->title,
    "categoriesSlug": categories[]->slug,
    body[]{
      ...,
      _type == 'image' => {
        "image": asset->{
          url,
          "alt": altText
        }
      }
    },
    mainImage{
      "media": asset->{url},
      "alt": asset->{altText}
    },
  }`);

  await Promise.all(data.map(processContent)); // Procesa todo el contenido en cada objeto
  return data; // Devuelve el array con las imágenes y textos ya procesados
};