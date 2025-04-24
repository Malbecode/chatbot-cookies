import OpenAI from "openai";
import dotenv from "dotenv";

dotenv.config();

const openaiApiKey = process.env.OPENAI_API_KEY;
const openaiModel = process.env.OPENAI_MODEL;

export const chat = async (prompt, question) => {
  try {
    const openai = new OpenAI({ apiKey: openaiApiKey });
    const completion = await openai.chat.completions.create({
      model: openaiModel,
      messages: [
        { role: "system", content: prompt },
        {
          role: "user",
          content: question,
        },
      ],
    });
    const answer = completion.choices[0].message.content;
    return answer;
  } catch (error) {
    console.error("Error connecting to OpenAI API:", error);
  }
};
