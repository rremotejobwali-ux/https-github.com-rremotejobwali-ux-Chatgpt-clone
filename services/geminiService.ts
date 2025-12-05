import { GoogleGenAI, Content, ChatSession } from "@google/genai";
import { Message, Role } from "../types";

const apiKey = process.env.API_KEY;

if (!apiKey) {
  console.error("API_KEY is missing from environment variables.");
}

const ai = new GoogleGenAI({ apiKey: apiKey || 'dummy-key' });

/**
 * Converts internal Message format to Gemini SDK Content format
 */
const formatHistory = (messages: Message[]): Content[] => {
  return messages.map((msg) => ({
    role: msg.role === Role.User ? 'user' : 'model',
    parts: [{ text: msg.content }],
  }));
};

/**
 * Creates a chat session and sends a message, yielding chunks for streaming
 */
export async function* streamGeminiResponse(
  history: Message[],
  newMessage: string
): AsyncGenerator<string, void, unknown> {
  try {
    // We use gemini-2.5-flash for a good balance of speed and chat capability
    const chat: ChatSession = ai.chats.create({
      model: 'gemini-2.5-flash',
      history: formatHistory(history),
      config: {
        temperature: 0.7,
        systemInstruction: "You are a helpful, concise, and intelligent AI assistant similar to ChatGPT. Format your responses using Markdown when appropriate."
      }
    });

    const result = await chat.sendMessageStream({ message: newMessage });

    for await (const chunk of result) {
      if (chunk.text) {
        yield chunk.text;
      }
    }
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
}