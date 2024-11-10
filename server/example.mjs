import OpenAI from "openai";
import dotenv from 'dotenv';

dotenv.config();

const openai = new OpenAI({
    organization: "org-ILR5PGHDz2TMN7TbELizo9ld",
    project: "proj_HRv67erRpJfTx2bUo3Qt7htF",
    apiKey: process.env.OPENAI_API_KEY,
});

const completion = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
        { role: "system", content: "You are a helpful assistant." },
        {
            role: "user",
            content: "Write a haiku about recursion in programming.",
        },
    ],
});

console.log(completion.choices[0].message);