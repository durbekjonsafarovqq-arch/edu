
import { GoogleGenAI } from "@google/genai";

export const getMotivationalMessage = async (coins: number, name: string): Promise<string> => {
  try {
    // Initialized GoogleGenAI with API key directly from environment variables as per guidelines
    const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
    const response = await ai.models.generateContent({
      model: 'gemini-3-flash-preview',
      contents: `Siz o'qituvchisiz. O'quvchingiz ismi ${name} va uning hozirda ${coins} EduCoin tangasi bor. Unga yanada ko'proq bilim olishga va tanga yig'ishga undovchi 1 ta qisqa motivatsion gap yozib bering (o'zbek tilida).`,
    });
    // response.text property provides the generated string
    return response.text || "Bilim - eng katta boylik! O'qishdan to'xtama.";
  } catch (error) {
    console.error("AI Error:", error);
    return "Har bir yangi bilim sizni muvaffaqiyatga yaqinlashtiradi!";
  }
};
