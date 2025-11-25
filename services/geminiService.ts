import { GoogleGenAI } from "@google/genai";
import { Preset } from "../types";

// Note: In a real production app, the key should be proxied. 
// However, per instructions, we use process.env.API_KEY directly.

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key não encontrada.");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  // Constructing a robust prompt for the model
  const finalPrompt = `
    Crie uma única imagem digital (arte 2D).
    Tema: ${userText}.
    ${preset.promptSuffix}
    Características obrigatórias:
    - Fundo 100% transparente (ou branco sólido puro se transparência não for possível, mas preferência por isolado).
    - Estilo de adesivo, estampa ou clipart.
    - Alta resolução, contornos definidos.
    - Sem sombras complexas cortadas.
    - Ideal para impressão em camisetas, canecas ou panos.
    - Não inclua texto na imagem a menos que pedido explicitamente.
  `;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        // We ask for JSON purely to potentially get structured metadata, 
        // but for image generation on 2.5-flash-image, we rely on the inlineData in the response parts.
        // Actually, 2.5-flash-image generates images when prompted correctly.
        // Let's not set responseMimeType to JSON as it might confuse the image generation request.
      }
    });

    // Parse response for image
    const candidates = response.candidates;
    if (candidates && candidates.length > 0) {
      for (const part of candidates[0].content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    throw new Error("O modelo não retornou uma imagem válida. Tente descrever de outra forma.");

  } catch (error) {
    console.error("Erro na geração:", error);
    throw error;
  }
};