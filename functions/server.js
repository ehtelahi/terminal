exports.handler = (event, context, callback) => {
  const express = require("express");
  const cors = require("cors");
  const path = require("path");
  const bodyParser = require("body-parser");
  const { Configuration, OpenAIApi } = require("openai");
  require("dotenv").config();

  const configuration = new Configuration({
    apiKey: process.env.OPENAI_API_KEY,
  });
  const openai = new OpenAIApi(configuration);

  const app = express();
  const port = process.env.PORT || 3000;

  const static_path = path.join(__dirname, "public");
  app.use(express.static(static_path));
  app.use(bodyParser.json());
  app.use(bodyParser.urlencoded({ extended: true }));
  app.use(cors());

  // Handling request
  app.post("/prompt", async (req, res) => {
    const response = await sendApiRequest(req.body.prompt);
    res.json(response.data);
  });

  // Server Setup
  app.listen(port, async () => {
    console.log(`server is running at ${port}`);
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
};
