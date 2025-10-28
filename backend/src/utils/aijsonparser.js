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

module.exports = { validateJsonFromAI };
