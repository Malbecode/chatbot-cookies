import { addKeyword, EVENTS } from "@builderbot/bot";
import { intentionsFlow } from "./intentios-flow";

export const mainFlow = addKeyword(EVENTS.WELCOME).addAction(
  async (ctx, ctxFn) => {
    return ctxFn.gotoFlow(intentionsFlow);
  }
);
