import { Preset } from "../types";

export const generateStamp = async (
  userText: string, 
  preset: Preset
): Promise<string> => {
  // 1. Correção da Variável de Ambiente para Vite
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;

  if (!apiKey) {
    throw new Error("Chave de API não configurada. Verifique o arquivo .env ou as configurações da Vercel.");
  }

  // Prompt otimizado para geração de imagem
  const finalPrompt = `
    Generate a high-quality 2D digital art sticker or clipart.
    Subject: ${userText}.
    Style Details: ${preset.promptSuffix}
    Requirements:
    - White background (pure white #FFFFFF).
    - Clear defined outlines.
    - No text inside the image.
    - High contrast, vivid colors.
    - Vector art style suitable for t-shirt printing.
  `;

  try {
    // 2. Uso direto do fetch para evitar conflitos de versão da SDK e erros de JSON "role"
    // Usando o modelo Imagen 3 (padrão atual do Google para imagens) via endpoint REST
    // Se o seu acesso for restrito, podemos tentar o 'gemini-2.0-flash-exp'
    
    // Tentativa 1: Endpoint de Imagem Dedicado (Imagen 3)
    const url = `https://generativelanguage.googleapis.com/v1beta/models/imagen-3.0-generate-001:predict?key=${apiKey}`;
    
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        instances: [
          { prompt: finalPrompt }
        ],
        parameters: {
          sampleCount: 1,
          aspectRatio: "1:1",
          outputOptions: { mimeType: "image/png" }
        }
      })
    });

    if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        console.error("Erro API Imagem:", errorData);
        throw new Error(`Erro na API (${response.status}): ${errorData.error?.message || response.statusText}`);
    }

    const data = await response.json();
    
    // Parse response for Imagen
    if (data.predictions && data.predictions.length > 0) {
        const base64 = data.predictions[0].bytesBase64Encoded;
        if (base64) {
            return `data:image/png;base64,${base64}`;
        }
    }

    throw new Error("O modelo não retornou uma imagem válida.");

  } catch (error: any) {
    console.error("Falha na geração:", error);
    
    // Fallback: Se o Imagen falhar (404/403), tenta o método antigo do Gemini 
    // (Apenas se você tiver acesso a beta models que geram imagem via generateContent, 
    // mas o código acima é o padrão oficial atual).
    throw new Error("Não foi possível gerar a imagem. Verifique se sua API Key tem permissão para o modelo 'imagen-3.0-generate-001'.");
  }
};