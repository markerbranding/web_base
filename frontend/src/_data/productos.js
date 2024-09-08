const client = require('../utils/sanityClient');
const processContent = require('../utils/contentProcessor');

module.exports = async function() {
  const data = await client.fetch(`*[_type == "productos"]{
    titleseo,
    descseo,
    keyseo,
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