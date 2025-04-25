import dotenv from "dotenv";

dotenv.config();

const CHATWOOT_API_URL = "https://cookies-wsp.site";
const INBOX_ID = process.env.INBOX_ID;
const ACCOUNT_ID = process.env.ACCOUNT_ID;
const CHATWOOT_API_TOKEN = process.env.CHATWOOT_API_TOKEN;

export const chatwootService = {
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

    const data = await response.json();

    return data.payload.contact_inbox;
  },

  createConversation: async (sourceId: string, inboxId: number) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations`,
      {
        method: "POST",
        headers: { api_access_token: CHATWOOT_API_TOKEN! },
        body: JSON.stringify({ source_id: sourceId, inbox_id: inboxId }),
      }
    );

    console.log("createConversation response: ", response);

    const data = await response.json();

    console.log("createConversation data: ", data);

    return data.id;
  },

  sendMessage: async (conversationId: number, content: string) => {
    const response = await fetch(
      `${CHATWOOT_API_URL}/api/v1/accounts/${ACCOUNT_ID}/conversations/${conversationId}/messages`,
      {
        method: "POST",
        headers: { api_access_token: CHATWOOT_API_TOKEN! },
        body: JSON.stringify({
          content,
          message_type: "incoming",
        }),
      }
    );

    console.log("sendMessage response: ", response);

    const data = await response.json();

    console.log("sendMessage data: ", data);

    return data;
  },
};
