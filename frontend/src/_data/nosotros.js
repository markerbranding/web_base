const client = require('../utils/sanityClient');
const processImages = require('../utils/imageProcessor');
const processPortableText = require('../utils/portableText');

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
        item[key] = processPortableText(item[key]);
      } else {
        // Llamada recursiva para propiedades de objetos anidados
        await processContent(item[key]);
      }
    }
  }
}

function isPortableTextBlock(value) {
  // Verificar si es un bloque único o un array de bloques
  if (Array.isArray(value)) {
    return value.some(subItem => subItem._type && subItem._type === 'block');
  }
  return value._type && value._type === 'block';
}

module.exports = async function() {
  const data = await client.fetch(`*[_type == "nosotros"]{
    titleseo,
    descseo,
    heroH1,
    heroH2,
    heroP,
    heroBtn,
    heroImg{
      "media": asset->{url},
      "alt": asset->{altText}
    },
  }`);

  await Promise.all(data.map(processContent)); // Procesa todo el contenido en cada objeto
  return data; // Devuelve el array con las imágenes y textos ya procesados
};