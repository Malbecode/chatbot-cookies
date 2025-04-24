import { createFlowRouting } from "@builderbot-plugins/langchain";
import { EVENTS } from "@builderbot/bot";
import path from "path";
import fs from "fs";

import { welcomeFlow } from "./welcome-flow.js";
import { openAIFlow } from "./openai-flow.js";

import dotenv from "dotenv";

dotenv.config();

const promptDetection = path.join(
  process.cwd(),
  "public/prompts",
  "intentions-detector.txt"
);
const detectedPrompt = fs.readFileSync(promptDetection, "utf8");

export const intentionsFlow = createFlowRouting
  .setKeyword(EVENTS.ACTION)
  .setIntentions({
    intentions: ["SALUDO", "FAQ", "NOT_DETECTED"],
    description: detectedPrompt,
  })
  .setAIModel({
    modelName: "openai",
    args: {
      modelName: process.env.OPENAI_MODEL,
      apikey: process.env.OPENAI_API_KEY,
    },
  })
  .create({
    afterEnd(flow) {
      return flow.addAction(async (ctx, { state, endFlow, gotoFlow }) => {
        try {
          console.log("Intention: ", await state.get("intention"));
          const intention = await state.get("intention");

          if (intention === "NOT_DETECTED") {
            return endFlow(
              "Tu mensaje esta fuera de contexto, por favor, intenta nuevamente."
            );
          }

          if (intention === "SALUDO") {
            return gotoFlow(welcomeFlow);
          }

          if (intention === "FAQ") {
            return gotoFlow(openAIFlow);
          }
        } catch (err) {
          console.error("Error al detectar la intencion: ", err);
        }
      });
    },
  });
