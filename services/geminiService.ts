import { GoogleGenerativeAI } from "@google/generative-ai";
import { Preset } from "../types";

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chave de API não configurada. Verifique VITE_GEMINI_API_KEY.");
  }

  const ai = new GoogleGenerativeAI(apiKey);

  const cleanText = userText.trim();

  const finalPrompt = `Crie uma arte em PNG, fundo transparente, alta resolução, tema: ${cleanText}. 
Estilo aplicado: ${preset.promptSuffix}
Inclua riqueza de detalhes, visual limpo e ideal para estampar.`;


  try {
    const model = ai.getGenerativeModel({
      model: "gemini-2.5-flash-image"
    });

    const response = await model.generateContent({
      contents: [
        {
          role: "user",
          parts: [{ text: finalPrompt }]
        }
      ],
      generationConfig: {
        responseMimeType: "image/png",
        aspectRatio: "1:1"
      }
    });

    const candidate = response.response.candidates?.[0];

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData?.mimeType?.startsWith("image/")) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    throw new Error("O modelo não retornou uma imagem válida.");

  } catch (error: any) {
    console.error("Erro na geração:", error);
    throw new Error(error.message || "Erro desconhecido.");
  }
};
