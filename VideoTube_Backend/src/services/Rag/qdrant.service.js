import {qdrant} from "../../db/qdrant.js"
import crypto from  "crypto"

export const storeEmbeddings = async({
    videoId, chunkText, embedding, 
})