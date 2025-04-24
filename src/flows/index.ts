import { mainFlow } from "./main-flow";
import { welcomeFlow } from "./welcome-flow";
import { openAIFlow } from "./openai-flow";
import { createFlow } from "@builderbot/bot";
import { intentionsFlow } from "./intentios-flow";

export const adapterFlow = createFlow([
  mainFlow,
  welcomeFlow,
  openAIFlow,
  intentionsFlow,
]);
