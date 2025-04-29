import dotenv from "dotenv";

dotenv.config();

const CHATWOOT_API_URL = "https://cookies-wsp.site";
const INBOX_ID = process.env.INBOX_ID;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const CHATWOOT_API_TOKEN = process.env.CHATWOOT_API_TOKEN;

export const chatwootService = {
  getContactByPhoneNumber: async (phoneNumber: string) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/contacts/search?q=${phoneNumber}`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al buscar el contacto: ${errorData.message}`);
    }

    const data = await response.json();

    const contact = data.payload.find(
      (contact: any) => contact.phone_number === `+${phoneNumber}`
    );

    const contactInbox = contact?.contact_inboxes.find((inbox: any) => {
      return inbox.inbox.id === Number(INBOX_ID);
    });

    return { contact, contactInbox };
  },

  createContact: async (name: string, phoneNumber: string) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/contacts`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
        body: JSON.stringify({
          inbox_id: INBOX_ID,
          name,
          phone_number: `+${phoneNumber}`,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear contacto: ${errorData.message}`);
    }

    const data = await response.json();

    return {
      newContact: data.payload.contact,
      newContactInbox: data.payload.contact_inbox,
    };
  },

  getExistingConversation: async (contactId: number) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/contacts/${contactId}/conversations`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al buscar la conversacion: ${errorData.message}`);
    }

    const data = await response.json();

    const conversationsInInbox = data.payload.filter(
      (conversation: any) => conversation.inbox_id === Number(INBOX_ID)
    );

    conversationsInInbox.sort(
      (a: any, b: any) =>
        new Date(b.last_activity_at).getTime() -
        new Date(a.last_activity_at).getTime()
    );

    return conversationsInInbox[0] || null;
  },

  createConversation: async (sourceId: string, inboxId: number) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
        body: JSON.stringify({ source_id: sourceId, inbox_id: inboxId }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al crear la conversacion: ${errorData.message}`);
    }

    const data = await response.json();

    return data.id;
  },

  receiveMessage: async (conversationId: number, content: string) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
        body: JSON.stringify({
          content,
          message_type: "incoming",
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al recibir el mensaje: ${errorData.message}`);
    }

    const data = await response.json();

    return data;
  },

  sendMessage: async (conversationId: number, content: string) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          api_access_token: CHATWOOT_API_TOKEN!,
        },
        body: JSON.stringify({
          content,
          message_type: "outgoing",
          private: false,
        }),
      }
    );

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(`Error al enviar el mensaje: ${errorData.message}`);
    }

    const data = await response.json();

    return data;
  },
};
