import { Request, Response } from "express";
import { chatwootService } from "~/services/chatwoot";

export const chatwootController = {
  handleIncomingMessage: async (req: Request, res: Response) => {
    try {
      const { name, from, body } = req;

      const { contact: existingContact, contactInbox: existingContactInbox } =
        await chatwootService.getContactByPhoneNumber(from);

      let contact;
      let contactInbox;

      if (existingContact) {
        contact = existingContact;
        contactInbox = existingContactInbox;
      } else {
        const { newContact, newContactInbox } =
          await chatwootService.createContact(name, from);

        contact = newContact;
        contactInbox = newContactInbox;
      }

      const openConversation = await chatwootService.getOpenConversation(
        contact.id
      );

      let conversationId;

      if (openConversation) {
        conversationId = openConversation.id;
      } else {
        conversationId = await chatwootService.createConversation(
          contactInbox.source_id,
          contactInbox.inbox.id
        );
      }

      const message = await chatwootService.sendMessage(conversationId, body);

      console.log("message: ", message);
    } catch (error) {
      console.error("Error handling incoming message:", error);
    }
  },
};
