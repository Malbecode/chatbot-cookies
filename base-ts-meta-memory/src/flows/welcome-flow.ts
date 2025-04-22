import { addKeyword, EVENTS } from "@builderbot/bot";

export const welcomeFlow = addKeyword(EVENTS.ACTION).addAction(
  async (ctx, ctxFn) => {
    const response = "Este es el flujo de bienvenida";
    return ctxFn.endFlow(response);
  }
);
