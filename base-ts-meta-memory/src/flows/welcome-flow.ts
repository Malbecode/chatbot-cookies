import { addKeyword, EVENTS } from "@builderbot/bot";
import { chat } from "~/scripts/openai";

export const welcomeFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, ctxFn) => {
    const response = await chat(
      "Sos un bot encargado de saludar cordialmente a la gente. Tienes que introducirte contando que eres un asistente virtual de un emprendimiento de cookies.",
      ctx.body
    );
    return ctxFn.endFlow(response);
  }
);
