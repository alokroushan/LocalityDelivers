import { GoogleGenAI, Type } from "@google/genai";

export const getLocalRecommendations = async (lat?: number, lng?: number, query: string = "Nearby shops and local businesses") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Step 1: Discover using Maps Grounding (Gemini 2.5 Flash)
  const discoveryModel = 'gemini-2.5-flash'; 
  const discoveryConfig: any = {
    tools: [{ googleMaps: {} }],
  };

  if (lat && lng) {
    discoveryConfig.toolConfig = {
      retrievalConfig: {
        latLng: {
          latitude: lat,
          longitude: lng
        }
      }
    };
  }

  try {
    const response = await ai.models.generateContent({
      model: discoveryModel,
      contents: `Find real, active local shops and small businesses within a 2km radius of my current location. 
      Query: ${query}. 
      Act as a hyper-local neighborhood guide. 
      List 6-8 highly-rated shops that are actually there. 
      Keep the response text very brief (2 sentences).`,
      config: discoveryConfig,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "Searching your neighborhood...";
    
    // Improved link extraction to be more resilient
    const links: { title: string, uri: string }[] = [];
    groundingChunks.forEach((chunk: any) => {
        if (chunk.maps?.uri && chunk.maps?.title) {
            links.push({
                title: chunk.maps.title,
                uri: chunk.maps.uri
            });
        }
    });

    // Step 2: Categorize using a fast text model
    if (links.length > 0) {
      const categorizationModel = 'gemini-flash-lite-latest';
      const catResponse = await ai.models.generateContent({
        model: categorizationModel,
        contents: `Categorize these local shops into 3-4 logical groups (e.g., 'Bakery & Sweets', 'Cafes & Dining', 'Retail & Services'). 
        Input Shops: ${JSON.stringify(links)}
        Return only a JSON array of categories.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Category name with a relevant emoji" },
                shops: {
                  type: Type.ARRAY,
                  items: {
                    type: Type.OBJECT,
                    properties: {
                      title: { type: Type.STRING },
                      uri: { type: Type.STRING }
                    },
                    required: ["title", "uri"]
                  }
                }
              },
              required: ["name", "shops"]
            }
          }
        }
      });

      return {
        text,
        categories: JSON.parse(catResponse.text || '[]')
      };
    }

    return { text, categories: [] };
  } catch (error) {
    console.error("Gemini Discovery Error:", error);
    return {
      text: "I couldn't pinpoint nearby shops right now. Please check if your API key has Maps tools enabled.",
      categories: []
    };
  }
};

export const getSmartSuggestions = async (cartItems: string[]) => {
  const model = 'gemini-3-flash-preview';
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  try {
    const response = await ai.models.generateContent({
      model,
      contents: `Based on these items in a user's local delivery cart: ${cartItems.join(', ')}, suggest 3 other items they might like from a local bakery, deli, or grocery store. Format as a JSON list of objects with 'title' and 'reason'.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              title: { type: Type.STRING },
              reason: { type: Type.STRING }
            },
            required: ["title", "reason"]
          }
        }
      }
    });

    return JSON.parse(response.text || '[]');
  } catch (error) {
    console.error("Smart Suggestions Error:", error);
    return [];
  }
};