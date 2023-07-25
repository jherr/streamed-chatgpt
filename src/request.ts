import { completeWithChatGPT } from "./openai";

const requests: Record<
  string,
  {
    completion: string;
    done: boolean;
  }
> = {};

export const getRequest = (requestId) => {
  return requests[requestId];
};

export const startRequest = async (prompt: string) => {
  const requestId = Math.random().toString(36).substring(2, 15);
  requests[requestId] = {
    completion: "",
    done: false,
  };

  completeWithChatGPT(
    `Funny saying about a ${prompt}`,
    (text) => {
      requests[
        requestId
      ].completion = `${requests[requestId].completion}${text}`;
    },
    () => {
      requests[requestId].done = true;
    }
  );

  return requestId;
};
