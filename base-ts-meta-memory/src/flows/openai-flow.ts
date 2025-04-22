import { addKeyword, EVENTS } from "@builderbot/bot";

export const openAIFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, ctxFn) => {
    const response = "Este es el flujo de OpenAI";
    return ctxFn.endFlow(response);
  }
);
