import { GoogleGenAI } from "@google/genai";
import { HealthMetric, HealthNote } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY || "" });

export async function getHealthInsights(metrics: HealthMetric[], notes: HealthNote[]) {
  const model = "gemini-3-flash-preview";
  
  const prompt = `
    Analyze the following health data and provide 3 personalized insights or tips.
    Metrics: ${JSON.stringify(metrics.slice(-10))}
    Recent Notes: ${JSON.stringify(notes.slice(-5))}
    
    Return the response in JSON format as an array of objects with 'title', 'description', and 'category' (one of: activity, nutrition, sleep, mental).
  `;

  try {
    const response = await ai.models.generateContent({
      model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
      },
    });

    return JSON.parse(response.text || "[]");
  } catch (error) {
    console.error("Error getting health insights:", error);
    return [];
  }
}
