const client = require('../utils/sanityClient');
const processPortableText = require('../utils/portableText');
const processImages = require('../utils/imageProcessor');

module.exports = async function() {
  const data = await client.fetch(`*[_type == "social"]{
    facebook,
    instagram,
    metaPixel,
    googleTag,
  }`);

  return await Promise.all(data.map(async item => {
    return {
      ...item,
    };
  }));
};