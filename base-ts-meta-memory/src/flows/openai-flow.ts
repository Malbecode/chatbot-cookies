import { addKeyword, EVENTS } from "@builderbot/bot";
import { chat } from "~/scripts/openai";
import path from "path";
import fs from "fs";

const contextPrompt = path.join(
  process.cwd(),
  "public/prompts",
  "context-prompt.txt"
);
const fullPrompt = fs.readFileSync(contextPrompt, "utf8");

export const openAIFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, ctxFn) => {
    const response = await chat(fullPrompt, ctx.body);

    return ctxFn.endFlow(response);
  }
);
