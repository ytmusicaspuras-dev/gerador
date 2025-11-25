import { GoogleGenerativeAI } from "@google/generative-ai";
import { Preset } from "../types";

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {

  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chave de API não configurada (VITE_GEMINI_API_KEY).");
  }

  const ai = new GoogleGenerativeAI(apiKey);

  const model = ai.getGenerativeModel({
    model: "gemini-2.5-flash-image"
  });

  const prompt = `Crie uma arte em PNG, fundo transparente, 1:1, tema: ${userText}.
Estilo: ${preset.promptSuffix}.
Alta resolução, detalhado, limpo e ideal para estampas.`;

  try {
    const response = await model.generateContent([
      {
        role: "user",
        parts: [{ text: prompt }]
      }
    ]);

    const part = response.response.candidates?.[0]?.content?.parts?.find(
      (p) => p.inlineData
    );

    if (!part) {
      throw new Error("Nenhuma imagem retornada pelo modelo.");
    }

    return `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;

  } catch (error: any) {
    console.error("Erro ao gerar imagem:", error);
    throw new Error(error.message || "Erro desconhecido.");
  }
};
