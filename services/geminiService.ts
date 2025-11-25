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
  
  const cleanText = userText.trim();

  // Constructing the prompt exactly as requested in the specification
  const finalPrompt = `Crie uma arte em PNG, fundo transparente, alta resolução, tema: ${cleanText}. 
Estilo aplicado: ${preset.promptSuffix}
Inclua riqueza de detalhes, visual limpo e ideal para estampar.`;

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash-image',
      contents: {
        parts: [{ text: finalPrompt }]
      },
      config: {
        imageConfig: {
          aspectRatio: "1:1",
        }
      }
    });

    // Parse response for image
    const candidate = response.candidates?.[0];
    
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    // Check if model returned text (e.g. refusal or safety warning)
    const textPart = candidate?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
        console.warn("Model returned text instead of image:", textPart.text);
        // Throw a user-friendly error based on the text if possible, or a generic one
        throw new Error(`Não foi possível gerar a imagem. O modelo respondeu: "${textPart.text.substring(0, 100)}..." Tente descrever de forma diferente.`);
    }

    throw new Error("O modelo não retornou uma imagem válida. Tente descrever de outra forma.");

  } catch (error: any) {
    console.error("Erro na geração:", error);
    throw new Error(error.message || "Erro desconhecido na geração.");
  }
};