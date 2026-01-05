
import { GoogleGenAI, Type } from "@google/genai";

export const getLocalRecommendations = async (lat?: number, lng?: number, query: string = "Show me local favorites") => {
  // Use gemini-2.5-flash for maps grounding
  const model = 'gemini-2.5-flash'; 
  
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });

  const config: any = {
    tools: [{ googleMaps: {} }],
  };

  if (lat && lng) {
    config.toolConfig = {
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
      model,
      contents: `Search for: ${query}. 
      Act as a neighborhood concierge. 
      IMPORTANT: Keep your verbal response brief (max 3-4 sentences). 
      Focus on providing high-quality map pins for small, local, neighborhood gems. 
      Avoid long lists in the text; let the map grounding do the heavy lifting.`,
      config,
    });

    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks || [];
    const text = response.text || "Searching our local network...";

    return {
      text,
      groundingChunks
    };
  } catch (error) {
    console.error("Gemini Error:", error);
    return {
      text: "I couldn't find any local spots right now. Please try a different query or check your connection.",
      groundingChunks: []
    };
  }
};

export const getSmartSuggestions = async (cartItems: string[]) => {
  const model = 'gemini-3-flash-preview';
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY || '' });
  
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
