import { GoogleGenAI } from "@google/genai";

const getAiClient = () => {
  const apiKey = process.env.API_KEY;
  if (!apiKey) {
    console.warn("API Key is missing. AI features will not work.");
    return null;
  }
  return new GoogleGenAI({ apiKey });
};

export const generateAnalysis = async (context: string, prompt: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable: Please configure API_KEY.";

  try {
    const fullPrompt = `
      Role: You are an expert ERP assistant for a University.
      Context: ${context}
      Task: ${prompt}
      Output: Provide a concise, professional, and actionable response. Format with Markdown.
    `;

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: fullPrompt,
    });

    return response.text || "No analysis generated.";
  } catch (error) {
    console.error("Gemini API Error:", error);
    return "Failed to generate analysis. Please try again.";
  }
};

export const generateJobDescription = async (role: string, department: string): Promise<string> => {
  const ai = getAiClient();
  if (!ai) return "AI Service Unavailable";

  try {
    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: `Write a professional job description for a "${role}" in the "${department}" department of a prestigious private university. Include responsibilities and requirements. Keep it under 200 words.`,
    });
    return response.text || "";
  } catch (error) {
    return "Error generating job description.";
  }
};
