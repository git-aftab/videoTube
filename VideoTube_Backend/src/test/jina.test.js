import axios from "axios";
import { storeEmbeddings } from "../services/Rag/qdrant.service.js";

const transcript = `
कुछ comment एकदम realistic चीजें बताते हैं, बताता हूँ आपको भी तो इस comment ने मुझसे पूछा है कि सर इतने सारे world के अंदर market के अंदर development के regarding roadmaps हैं तो लोग कर क्यों नहीं लिते actually में expectations, हाँ जी time और expectation की problem है, बताता हूँ कैसे देखिए जब आप development सीखते हो ना तो एक साल लगता है पूरा हाँ जी अब ये देखो बताते नहीं है ऐसे लोगों को लगता है मैं छह महीने में कर लूँगा नहीं छह महीने तो आप तब करोगे ना सिक्स मंथ का तो guided आपका walk through होता है कि यह चीजे होती है, उन सब को practice करने के लिए और 6 month लगता है और realistically जब आप बात करते हो तो एक साल यह उससे ज़ादा आपको एक decent developer बनने में लगता है, लोगों को लगता है कि मैं 3 मेने में बन जाओंगा, 6 मेने में बन जाओंगा ऐसा होता नहीं है जबकि course है whatever it takes, तो 3 महिने तो वहाँ लगते हैं, और उसको practice करने के लिए फिर से 3 महिने लगते हैं, given the fact कि आप programming में अच्छे हो, आपने decent project भी बना रखे हैं, तब जाके 6 पूरा month, और कई बार तो 8 month 9 month भी लगते हैं लोगों को, लेकिन expectation यह है, सुबह DSA कर लूँगा, शाम को development कर लूँगा, होता कुछ है नहीं, और आपको real scroll करते हुए मैं दिख जाता हूँ फिर, तो अपने आपको overestimate करना, यह सब करना, इसकी वज़े से यह roadmap execute नहीं हो पाते है, इतना भी जल्दी नहीं होती है चीज़े, चीज़ों को साल भर भी लगता है, दो साल भी लगते हैं, कई बार एक decent developer बनने में, but आपको चीज़े तीन महिने में तो, roadmap की क्या गलती जी? `;

async function testEmbedding() {
  try {
    const { data } = await axios.post(
      "https://api.jina.ai/v1/embeddings",
      {
        embedding_type: "float",
        input: transcript,
        model: "jina-embeddings-v3",
        normalized: true,
        truncate: false,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.JINA_API_KEY}`,
        },
      },
    );

    const embedding = data.data[0].embedding;

    console.log("Embedding Dimension:", embedding.length);

    await storeEmbeddings({
      videoId: "test-video-1",
      chunkText: transcript,
      embedding,
      chunkIndex: 0,
    });

    console.log("Successfully stored in Qdrant");
  } catch (error) {
    console.error("Failed:", error.response?.data || error.message);
  }
}

testEmbedding();