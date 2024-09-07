const client = require('../utils/sanityClient');
const processContent = require('../utils/contentProcessor');

module.exports = async function() {
  const data = await client.fetch(`*[_type == "aviso"]{
    titleseo,
    descseo,
    heroH1,
    slug,
    avisoText,
  }`);

  await Promise.all(data.map(processContent)); // Procesa todo el contenido en cada objeto
  return data; // Devuelve el array con las imágenes y textos ya procesados
};