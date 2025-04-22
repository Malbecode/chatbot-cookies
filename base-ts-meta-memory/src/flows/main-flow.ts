import { addKeyword, EVENTS } from "@builderbot/bot";

export const mainFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, ctxFn) => {
    const response = "Este es el flujo principal";
    return ctxFn.endFlow(response);
  }
);
