import { createBot } from "@builderbot/bot";
import { MemoryDB as Database } from "@builderbot/bot";
import { adapterFlow } from "./flows";
// import { adapterProvider } from "./provider/meta";
import { adapterProvider } from "./provider/baileys";
import dotenv from "dotenv";
import { chatwootController } from "./controllers/chatwoot";

dotenv.config();

const PORT = process.env.PORT ?? 3008;

const main = async () => {
  const adapterDB = new Database();

  const bot = await createBot({
    flow: adapterFlow,
    provider: adapterProvider,
    database: adapterDB,
  });

  adapterProvider.server.post(
    "/v1/chatwoot",
    bot.handleCtx(async (bot, req, res) => {
      const payload = req.body;
      console.log("payload: ", payload);
      return res.end("sended");
    })
  );

  adapterProvider.server.post(
    "/v1/messages",
    bot.handleCtx(async (bot, req, res) => {
      const { number, message, urlMedia } = req.body;
      await bot.sendMessage(number, message, { media: urlMedia ?? null });
      return res.end("sended");
    })
  );

  adapterProvider.server.post(
    "/v1/register",
    bot.handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot.dispatch("REGISTER_FLOW", { from: number, name });
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/samples",
    bot.handleCtx(async (bot, req, res) => {
      const { number, name } = req.body;
      await bot.dispatch("SAMPLES", { from: number, name });
      return res.end("trigger");
    })
  );

  adapterProvider.server.post(
    "/v1/blacklist",
    bot.handleCtx(async (bot, req, res) => {
      const { number, intent } = req.body;
      if (intent === "remove") bot.blacklist.remove(number);
      if (intent === "add") bot.blacklist.add(number);

      res.writeHead(200, { "Content-Type": "application/json" });
      return res.end(JSON.stringify({ status: "ok", number, intent }));
    })
  );

  bot.httpServer(+PORT);

  adapterProvider.on(
    "message",
    bot.handleCtx(async (bot, req, res) => {
      chatwootController.handleIncomingMessage(req, res);
    })
  );

  bot.on("send_message", ({ answer, from }) => {
    console.log(`Send Message Payload:`, { answer, from });
  });
};

main();
