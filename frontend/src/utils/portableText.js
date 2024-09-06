const { toHTML } = require('@portabletext/to-html');

function processPortableText(blocks) {
  return toHTML(blocks, {
    types: {
      block: ({ node, children }) => {
        // Aquí manejas los bloques de texto normales
        if (node.style === 'normal') {
          return `<p>${children.join('')}</p>`;
        }
        // Podrías añadir aquí un manejo especial si las imágenes están dentro de bloques
        return `<div>${children.join(' ')}</div>`; // Manejo por defecto para otros estilos
      },
      image: ({ node }) => {
        // Esto se ejecuta solo para bloques de tipo 'image'
        console.log("Procesando imagen:", node);
        if (!node || !node.image || !node.image.url) {
          console.log("Imagen sin URL", node);
          return ''; // Si no hay URL de imagen, no renderizar nada
        }
        const url = node.image.url;
        const alt = node.alt || 'Imagen sin descripción';
        return `<img src="${url}" alt="${alt}">`;
      }
    },
    defaultBlock: ({ node, children }) => {
      // Este es un manejo por defecto para cualquier tipo de bloque no especificado
      console.log('Bloque no reconocido:', node._type);
      return `<div>${children.join(' ')}</div>`;
    }
  });
}

module.exports = processPortableText;