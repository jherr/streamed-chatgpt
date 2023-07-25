import https from "node:https";

export const completeWithChatGPT = (
  prompt: string,
  tokenCallback: (text: string) => void,
  endCallback: () => void,
  options: object = {}
) => {
  const req = https.request(
    {
      hostname: "api.openai.com",
      port: 443,
      path: "/v1/completions",
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
      },
    },
    function (res) {
      res.on("data", (chunk) => {
        if (chunk.toString().startsWith("data: ")) {
          const data = chunk.toString().replace(/^data: /, "");
          try {
            JSON.parse(data).choices.forEach((choice) => {
              tokenCallback(choice.text);
            });
          } catch (e) {}
        }
      });
      res.on("end", endCallback);
    }
  );

  const body = JSON.stringify({
    model: "text-davinci-003",
    prompt,
    temperature: 0.6,
    max_tokens: 512,
    top_p: 1.0,
    frequency_penalty: 0.5,
    presence_penalty: 0.7,
    stream: true,
    ...options,
  });

  req.on("error", (e) => {
    console.error("problem with request:" + e.message);
  });

  req.write(body);
  req.end();
};
