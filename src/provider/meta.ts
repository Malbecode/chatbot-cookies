import { createProvider } from "@builderbot/bot";
import { MetaProvider } from "@builderbot/provider-meta";
import dotenv from "dotenv";

dotenv.config();

export const adapterProvider = createProvider(MetaProvider, {
  jwtToken: process.env.JWT_TOKEN,
  numberId: process.env.NUMBER_ID,
  verifyToken: process.env.VERIFY_TOKEN,
  version: process.env.VERSION,
});
