import axios from "axios";

export const generateSearchFilters = async (userQuery) => {
  const model = process.env.OPENAI_MODEL || "gpt-3.5-turbo";
  try {
    const prompt = `You are a smart product search assistant. Extract search filters from the user's query. Only return valid compact JSON object without backticks or explanations. Keys may include: category (string), keyword (string), minPrice (number), maxPrice (number). User query: "${userQuery}"`;

    const response = await axios.post(
      "https://api.openai.com/v1/chat/completions",
      {
        model,
        messages: [
          { role: "system", content: "You are a helpful assistant." },
          { role: "user", content: prompt },
        ],
        temperature: 0.2,
        max_tokens: 150,
      },
      {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${process.env.OPENAI_API_KEY}`,
        },
        timeout: 10000,
      }
    );

    const aiText = response.data.choices?.[0]?.message?.content?.trim() || "{}";

    try {
      const parsed = JSON.parse(aiText);
      return typeof parsed === 'object' && parsed !== null ? parsed : {};
    } catch (error) {
      return { keyword: userQuery };
    }
  } catch (error) {
    return { keyword: userQuery };
  }
};
