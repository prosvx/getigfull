import { GoogleGenAI, Type } from "@google/genai";
import { Profile } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });

export async function generateProfileData(prompt: string): Promise<Profile> {
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `Gere um perfil de Instagram realista baseado nesta descrição: "${prompt}". 
    Retorne em formato JSON. 
    Certifique-se de gerar exatamente 6 posts. 
    As legendas devem ser em português do Brasil e incluir hashtags relevantes.
    Os prompts de imagem (imagePrompt e profilePicturePrompt) devem ser em INGLÊS e muito detalhados, otimizados para um gerador de imagens de IA.
    Para o 'username', crie um nome de usuário EXTREMAMENTE ÚNICO e original (usando combinações criativas, sublinhados, ou números específicos) para que haja uma probabilidade altíssima de estar disponível no Instagram atualmente. Evite nomes genéricos.`,
    config: {
      responseMimeType: "application/json",
      responseSchema: {
        type: Type.OBJECT,
        properties: {
          username: { type: Type.STRING },
          fullName: { type: Type.STRING },
          bio: { type: Type.STRING },
          followers: { type: Type.STRING, description: "Ex: 10.2K, 1.5M, 500" },
          following: { type: Type.STRING },
          profilePicturePrompt: { type: Type.STRING, description: "Prompt in English to generate the profile picture. Must be a portrait." },
          posts: {
            type: Type.ARRAY,
            items: {
              type: Type.OBJECT,
              properties: {
                id: { type: Type.STRING },
                imagePrompt: { type: Type.STRING, description: "Prompt in English to generate the post image. Must be a square aspect ratio." },
                caption: { type: Type.STRING, description: "Instagram caption in Portuguese including hashtags." },
                likes: { type: Type.STRING, description: "Ex: 1,234" },
                comments: { type: Type.STRING, description: "Ex: 45" }
              },
              required: ["id", "imagePrompt", "caption", "likes", "comments"]
            }
          }
        },
        required: ["username", "fullName", "bio", "followers", "following", "profilePicturePrompt", "posts"]
      }
    }
  });
  return JSON.parse(response.text!) as Profile;
}

export async function generateImage(prompt: string): Promise<string> {
  const response = await ai.models.generateContent({
    model: 'gemini-2.5-flash-image',
    contents: {
      parts: [
        { text: prompt }
      ]
    },
    config: {
      imageConfig: {
        aspectRatio: "1:1",
      }
    }
  });

  for (const part of response.candidates?.[0]?.content?.parts || []) {
    if (part.inlineData) {
      return `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`;
    }
  }
  throw new Error("No image generated");
}

export async function generateImageSafe(prompt: string): Promise<string> {
  try {
    return await generateImage(prompt);
  } catch (e) {
    console.error("Image generation failed for prompt:", prompt, e);
    // Return a placeholder if generation fails (e.g. due to safety filters)
    return `https://picsum.photos/seed/${encodeURIComponent(prompt.substring(0, 20))}/400/400`;
  }
}
