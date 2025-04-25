import { Request, Response } from "express";
import { chatwootService } from "~/services/chatwoot";

export const chatwootController = {
  handleIncomingMessage: async (req: Request, res: Response) => {
    try {
      const { name, from, body } = req;
      const contactInbox = await chatwootService.createContact(name, from);

      const conversationId = await chatwootService.createConversation(
        contactInbox.source_id,
        contactInbox.inbox.id
      );

      console.log("conversationId: ", conversationId);

      const message = await chatwootService.sendMessage(conversationId, body);

      console.log("message: ", message);

      res.status(200).send("Message processed successfully.");
    } catch (error) {
      console.error("Error handling incoming message:", error);
      res.status(500).send("Internal Server Error");
    }
  },
};
