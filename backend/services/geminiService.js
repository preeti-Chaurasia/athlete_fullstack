const Groq = require("groq-sdk");

const groq = new Groq({
  apiKey: process.env.GROQ_API_KEY
});

async function getCoachFeedback(promptText) {
  try {
    const completion = await groq.chat.completions.create({
      messages: [
        {
          role: "system",
          content: "You are an expert sports coach AI."
        },
        {
          role: "user",
          content: promptText
        }
      ],
      model: "llama-3.1-8b-instant"
    });

    return completion.choices[0].message.content;

  } catch (error) {
    console.log(error);
    return "AI error";
  }
}

module.exports = { getCoachFeedback };