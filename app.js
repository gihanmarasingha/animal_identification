const express = require('express');
const bodyParser = require('body-parser');
const { OpenAI } = require("openai");

require('dotenv').config();

const SYSTEM_MESSAGE = "You are an assistant, called Annie, designed to help me identify an animal \
by asking me probing questions until you can identify the animal. Don't simply ask more for more \
information. If you have difficulty, try to ask questions that will help place the animal into a \
category of animals. You can ask questions not just about the animal's physical characteristics, \
but also about its behavior, habitat, and diet, and relationship to humans and to me. Only talk \
about animal identification: do not discuss other topics.";

let conversationHistory = [
    { role: "system", content: SYSTEM_MESSAGE }
];
let lastInteractionTime = Date.now();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

const app = express();
app.use(bodyParser.json());  // Updated to handle JSON input
app.use(express.static('public'));



function resetConversationHistory() {
    // Retain the last 20 messages, if there are more than 20
    if (conversationHistory.length > 20) {
        conversationHistory = conversationHistory.slice(-20);
    }
    // Ensure the system message is at the start of the conversation
    if (conversationHistory[0].content !== SYSTEM_MESSAGE) {
        conversationHistory.unshift({ role: "system", content: SYSTEM_MESSAGE });
    }
}

app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
});


app.post('/ask', async (req, res) => {
    const currentTime = Date.now();
    
    // Check if the last interaction was more than 30 minutes ago
    if (currentTime - lastInteractionTime > 1800000) {  // 1800000 milliseconds = 30 minutes
        resetConversationHistory();  // Reset history if the session has been inactive for over 30 minutes
    }
    
    // Update last interaction time to current time
    lastInteractionTime = currentTime;

    const userInput = req.body.message;
    conversationHistory.push({ role: "user", content: userInput });

    try {
        const response = await openai.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: conversationHistory,
        });

        const aiMessage = response.choices[0].message.content;
        conversationHistory.push({ role: "assistant", content: aiMessage });

        res.json({ answer: aiMessage });
    } catch (error) {
        console.error('Error with OpenAI API:', error);
        res.status(500).send('Failed to process your request');
    }
});

const port = 3000;
app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});