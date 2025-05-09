import { Request, Response } from "express";
import { chatwootService } from "~/services/chatwoot";

export const chatwootController = {
  handleIncomingMessage: async (req: Request, res: Response) => {
    try {
      const { name, from, body } = req;

      const { contact: existingContact, contactInbox: existingContactInbox } =
        await chatwootService.getContactByPhoneNumber(from);

      let contact = existingContact;
      let contactInbox = existingContactInbox;

      if (!existingContact) {
        const { newContact, newContactInbox } =
          await chatwootService.createContact(name, from);

        contact = newContact;
        contactInbox = newContactInbox;
      }

      const existingConversation =
        await chatwootService.getExistingConversation(contact.id);

      let conversationId = existingConversation?.id;

      if (!existingConversation) {
        conversationId = await chatwootService.createConversation(
          contactInbox.source_id,
          contactInbox.inbox.id
        );
      }

      await chatwootService.receiveMessage(conversationId, body);
    } catch (error) {
      console.error("Error handling incoming message:", error);
    }
  },

  handleOutgoingMessage: async (req: Request, res: Response) => {
    try {
      const { answer, from } = req;

      const { contact } = await chatwootService.getContactByPhoneNumber(from);

      const conversation = await chatwootService.getExistingConversation(
        contact.id
      );

      await chatwootService.sendMessage(conversation.id, answer);
    } catch (error) {
      console.error("Error handling outgoing message:", error);
    }
  },
};
