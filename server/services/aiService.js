const { GoogleGenerativeAI } = require("@google/generative-ai");

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function analyzePerformance(data) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const result = await model.generateContent({
            contents: [
                {
                    role: "user",
                    parts: [{ text: `Analyze this: ${JSON.stringify(data)}` }],
                },
            ],
        });

        const responseText = result.response.text();
        return {
            analysis: responseText,
            timestamp: new Date().toISOString()
        };
    } catch (error) {
        console.error("AI Error:", error);
        return { analysis: "AI analysis failed", error: true };
    }
}

async function getChatbotResponse(question, context) {
    try {
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
        });

        const prompt = `Context: ${context}\n\nQuestion: ${question}`;
        const result = await model.generateContent(prompt);
        return result.response.text();
    } catch (error) {
        console.error("Chatbot Error:", error);
        return "I'm having trouble connecting to my AI brain right now.";
    }
}

module.exports = { analyzePerformance, getChatbotResponse };