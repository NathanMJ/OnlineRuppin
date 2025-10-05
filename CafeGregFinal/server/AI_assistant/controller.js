import OpenAI from "openai";
import 'dotenv/config';


const client = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY, // ⚠️ mets ta clé dans .env, pas en dur !
});

export async function getHelp(req, res) {
    try {
        const question = req.body.question;

        if (!question) {
            return res.status(400).json({ message: "Missing question" });
        }

        // Appel à OpenAI
        const response = await client.chat.completions.create({
            model: "gpt-3.5-turbo",
            messages: [{ role: "user", content: question }],
        });

        const answer = response.choices[0].message.content;

        return res.status(200).json({ answer });
    } catch (err) {
        return res.status(500).json({ answer:"Thank you for contacting",error: err.message });
    }
}


