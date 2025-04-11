const express = require("express");
const dotenv = require("dotenv");
const cors = require("cors");

const { GoogleGenerativeAI } = require("@google/generative-ai");
const generatePrompt = require("./prompt");

// console.log("Loaded API Key:", process.env.GOOGLE_API_KEY);


// Load environment variables
dotenv.config();

// Initialize Express and middleware
const app = express();
app.use(express.json());
app.use(cors());

// Initialize Google Generative AI client
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY);

const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });

// Create an API endpoint for chatbot responses
app.post("/chat", async (req, res) => {
    const userInput = req.body.input;

    if (!userInput) {
        return res.status(400).json({ error: "Please provide a valid input." });
    }

    const prompt = generatePrompt(userInput);

    try {
        // Sending request to Google Generative AI
        const result = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }]
        });

        // Extracting AI response
        const responseText = result.response?.candidates?.[0]?.content?.parts?.[0]?.text || "No response generated.";

        // Sending response back to the client
        res.status(200).json({ response: responseText });

    } catch (error) {
        console.error("Error generating content:", error);
        res.status(500).json({ error: "Failed to generate content. Please try again later." });
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(` Server running on http://localhost:${PORT}`));
