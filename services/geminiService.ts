import { GoogleGenAI, Type } from "@google/genai";

export const getLocalRecommendations = async (lat?: number, lng?: number, query: string = "Nearby shops and local businesses") => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Step 1: Discover using Maps + Search Grounding (Gemini 2.5 Flash)
  const discoveryModel = 'gemini-2.5-flash'; 
  const discoveryConfig: any = {
    // Maps grounding is only supported in Gemini 2.5 series
    // googleMaps may be used with googleSearch
    tools: [{ googleMaps: {} }, { googleSearch: {} }],
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
      contents: `You are a local neighborhood expert. Find and list 8-12 real, active local shops and small businesses within 2km of the current location. 
      Context: ${query}. 
      Mention their names clearly in your response. 
      Keep the introductory text very short (max 2 sentences).`,
      config: discoveryConfig,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "Scanning your immediate neighborhood for the best gems...";
    
    // Comprehensive extraction from all possible grounding types
    const links: { title: string, uri: string }[] = [];
    groundingChunks.forEach((chunk: any) => {
        if (chunk.maps?.uri) {
            links.push({
                title: chunk.maps.title || "Local Shop",
                uri: chunk.maps.uri
            });
        } else if (chunk.web?.uri) {
            links.push({
                title: chunk.web.title || "Local Business",
                uri: chunk.web.uri
            });
        }
    });

    // Deduplicate links by URI
    const uniqueLinks = Array.from(new Map(links.map(item => [item.uri, item])).values());

    // Step 2: Categorize using the ultra-fast Gemini 3 Flash model
    if (uniqueLinks.length > 0) {
      const categorizationModel = 'gemini-3-flash-preview';
      const catResponse = await ai.models.generateContent({
        model: categorizationModel,
        contents: `Organize these neighborhood locations into exactly 3 or 4 meaningful categories (e.g., 'Bakery & Sweets', 'Dining & Cafes', 'Retail & Essentials').
        Data: ${JSON.stringify(uniqueLinks)}
        Respond strictly with a JSON array.`,
        config: {
          responseMimeType: "application/json",
          responseSchema: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                name: { type: Type.STRING, description: "Category name starting with a relevant emoji" },
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
    console.error("Discovery Error:", error);
    return {
      text: "We're currently highlighting our verified community partners. Check out the curated list below!",
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
      contents: `Analyze these local cart items: ${cartItems.join(', ')}. Suggest 3 complementary local items. Return a JSON list with 'title' and 'reason'.`,
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
    return [];
  }
};