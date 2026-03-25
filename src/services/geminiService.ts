import { GoogleGenAI, Type } from "@google/genai";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || '' });

export const generateProductDescription = async (productName: string, category: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Generate a professional, persuasive, and SEO-friendly product description for a ${productName} in the ${category} category. Focus on quality, comfort, and style.`,
    });
    return response.text;
  } catch (error) {
    console.error("AI Description Error:", error);
    return null;
  }
};

export const getAIRecommendations = async (userInterests: string[], allProducts: any[]) => {
  try {
    const productList = allProducts.map(p => `${p.name} (${p.category})`).join(', ');
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `Based on the user's interests: ${userInterests.join(', ')}, recommend 3 products from this list: ${productList}. Return only the product names as a comma-separated list.`,
    });
    return response.text?.split(',').map(name => name.trim()) || [];
  } catch (error) {
    console.error("AI Recommendation Error:", error);
    return [];
  }
};

export const chatWithAssistant = async (message: string, context: string) => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-flash-preview",
      contents: `You are a helpful AI assistant for UltraHouse, a premium furniture store. 
      Context: ${context}
      User: ${message}
      Assistant:`,
      config: {
        systemInstruction: "Be professional, helpful, and concise. Help users find products, answer questions about shipping/returns, and provide interior design advice.",
      }
    });
    return response.text;
  } catch (error) {
    console.error("AI Chat Error:", error);
    return "I'm sorry, I'm having trouble connecting right now. How else can I help you?";
  }
};
