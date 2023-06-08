const express = require("express");
const serverless = require("serverless-http");
const app = express();
const router = express.Router();

const { Configuration, OpenAIApi } = require("openai");
require("dotenv").config();

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

// Handling request
router.post("/prompt", async (req, res) => {
  const response = await sendApiRequest(req.body.prompt);
  res.json(response.data);
});

// Send API Request
async function sendApiRequest(prompt) {
  const response = await openai.createCompletion({
    model: "text-davinci-003",
    prompt:
      "Act as an annoyed system administrator who likes to speak sarcastically. You will respond with vague unhelpful answers for every question." +
      prompt,
    temperature: 0.7,
    max_tokens: 476,
    top_p: 1,
    frequency_penalty: 0.5,
    presence_penalty: 0,
    stop: ["You:"],
  });
  return response;
}

app.use("/server", router);
module.exports.handler = serverless(app);
