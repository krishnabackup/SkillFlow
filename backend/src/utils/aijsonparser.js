const validateJsonFromAI = (response) => {
    const text = (response.text)?.toString();
    if (!text) throw new Error("Empty AI Response");

    // Remove code block markup
    let cleaned = text.replace(/``````/g, "").trim();

    // Extract everything between first { and last }
    const m = cleaned.match(/\{[\s\S]*\}/);
    if (!m) throw new Error("No JSON object detected in AI output");
    let rawJson = m[0];

    // Defensive fix: Escape all unescaped newlines inside double-quoted values
    rawJson = rawJson.replace(/"([^"\\]*(\\.[^"\\]*)*)"/g, match => {
        return match.replace(/\n/g, '\\n');
    });

    // Remove trailing commas before ] or }
    rawJson = rawJson.replace(/,\s*([\}\]])/g, '$1');

    // Simple check for truncation: unbalanced quotes or brackets -> reject
    const openedQuotes = (rawJson.match(/"/g) || []).length;
    const openedBraces = (rawJson.match(/\{/g) || []).length;
    const closedBraces = (rawJson.match(/\}/g) || []).length;
    if (openedQuotes % 2 !== 0 || openedBraces !== closedBraces) {
        throw new Error("Truncated or incomplete JSON from AI, cannot parse safely.");
    }

    try {
        const parsed = JSON.parse(rawJson);
        return parsed;
    } catch (e) {
        throw new Error("Invalid JSON from AI: " + e.message + " - raw: " + (rawJson.slice(0, 200)));
    }
};

function cleanQuizData(rawResponse) {
  try {
    // Remove code block markers and trim
    const jsonString = rawResponse
      .replace(/```(json)?/g, "")
      .replace(/[\u201C\u201D]/g, '"') // Fix curly quotes
      .trim();

    let data = JSON.parse(jsonString);

    // Ensure array format
    if (!Array.isArray(data)) data = [data];

    // Normalize structure
    return data.map((item) => ({
      question: item.question?.trim() || "",
      options: (item.options || []).map((opt) => opt.trim()),
      correct_answer: item.correct_answer?.trim() || "",
    }));
  } catch (err) {
    console.error("Error cleaning quiz data:", err);
    return [];
  }
}

module.exports = { validateJsonFromAI , cleanQuizData };
