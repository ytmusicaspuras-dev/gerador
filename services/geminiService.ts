import { GoogleGenerativeAI } from "@google/generative-ai";
import { Preset } from "../types";

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {
  
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chave de API não configurada. Verifique as variáveis de ambiente (VITE_GEMINI_API_KEY).");
  }

  // Instância correta do SDK
  const ai = new GoogleGenerativeAI(apiKey);

  const cleanText = userText.trim();

  const finalPrompt = `Crie uma arte em PNG, fundo transparente, alta resolução, tema: ${cleanText}. 
Estilo aplicado: ${preset.promptSuffix}
Inclua riqueza de detalhes, visual limpo e ideal para estampar.`;

  try {
    const model = ai.getGenerativeModel({ model: "gemini-2.5-flash-image" });

    const response = await model.generateContent({
      contents: [
        { role: "user", parts: [{ text: finalPrompt }] }
      ],
      generationConfig: {
        imageConfig: {
          aspectRatio: "1:1"
        }
      }
    });

    const candidate = response.response.candidates?.[0];

    if (candidate?.content?.parts) {
      for (const part of candidate.content.parts) {
        if (part.inlineData && part.inlineData.mimeType.startsWith("image/")) {
          return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
        }
      }
    }

    const textPart = candidate?.content?.parts?.find(p => p.text);
    if (textPart?.text) {
      console.warn("Model returned text instead of image:", textPart.text);
      throw new Error(
        `Não foi possível gerar a imagem. O modelo respondeu: "${textPart.text.substring(0, 100)}..." Tente descrever de forma diferente.`
      );
    }

    throw new Error("O modelo não retornou uma imagem válida. Tente descrever de outra forma.");
  } catch (error: any) {
    console.error("Erro na geração:", error);
    throw new Error(error.message || "Erro desconhecido na geração.");
  }
};
