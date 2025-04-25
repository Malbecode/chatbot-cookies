import { createProvider } from "@builderbot/bot";
import { BaileysProvider } from "@builderbot/provider-baileys";
import dotenv from "dotenv";

dotenv.config();

export const adapterProvider = createProvider(BaileysProvider);
