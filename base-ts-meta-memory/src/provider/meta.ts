import { createProvider } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";

export const adapterProvider = createProvider(MetaProvider, {
  jwtToken: process.env.JWT_TOKEN,
  numberId: process.env.NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
  version: process.env.VERSION,
});
