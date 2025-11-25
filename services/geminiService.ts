import { GoogleGenAI } from "@google/genai";
import { Preset } from "../types";

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  
  const cleanText = userText.trim();

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

    const candidate = response.candidates?.[0];
    
    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
           return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }
    
    const textPart = candidate?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
        console.warn("Model returned text instead of image:", textPart.text);
        throw new Error(`Não foi possível gerar a imagem. O modelo respondeu: "${textPart.text.substring(0, 100)}..." Tente descrever de forma diferente.`);
    }

    throw new Error("O modelo não retornou uma imagem válida. Tente descrever de outra forma.");

  } catch (error: any) {
    console.error("Erro na geração:", error);
    throw new Error(error.message || "Erro desconhecido na geração.");
  }
};