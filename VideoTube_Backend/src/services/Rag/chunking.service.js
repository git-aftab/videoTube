const approximateTokens = (text) => {
  return Math.ceil(text.length / 4);
};

const splitBySize = (text, sectionName, startIndex) => {
    const chunks = []
    const words = text.split(" ") //split by spaces

    const maxWords = Math.floor(CHUNK_SIZE);
    const overlapWords = Math.floor(CHUNK_OVERLAP)

    let start  = 0;
    let chunkOffset = 0;

    
};
