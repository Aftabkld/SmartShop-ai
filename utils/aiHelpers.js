import axios from "axios";

export const generateSearchFilters = async (userQuery) => {
  try {
    const prompt = `
You are a smart product search assistant. Your job is to extract search filters from the user's query.
Extract category, color, price range, brand, or other relevant filters from the query.
Respond strictly in valid JSON format like:
{
  "category": "bags",
  "color": "brown",
  "maxPrice": 3000
}

User query: "${userQuery}"
`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model: "gpt-3.5-turbo",
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.3,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
      }
    );

    const aiText = response.data.choices[0].message.content.trim();

    // Parse the JSON safely
    try {
      return JSON.parse(aiText);
    } catch (error) {
      console.error("Invalid JSON returned by AI:", aiText);
      return {};
    }
  } catch (error) {
    console.error("AI search error:", error.message);
    return {};
  }
};
