const { validateJsonFromAI } = require('../../src/utils/aijsonparser');

describe('validateJsonFromAI', () => {
  test('parses valid prefixed JSON from AI response', () => {
    const response = {
      choices: [
        {
          message: {
            content: "Some text before ```json{\"foo\": \"bar\"}``` and after"
          }
        }
      ]
    };

    const parsed = validateJsonFromAI(response);
    expect(parsed).toEqual({ foo: 'bar' });
  });

  test('throws on empty response text', () => {
    const response = { choices: [ { message: { content: '' } } ] };
    expect(() => validateJsonFromAI(response)).toThrow(/Empty AI Response/);
  });

  test('throws when no JSON object present', () => {
    const response = { choices: [ { message: { content: 'no json here' } } ] };
    expect(() => validateJsonFromAI(response)).toThrow(/No JSON object detected/);
  });

  test('throws on invalid JSON content', () => {
    const response = { choices: [ { message: { content: '```json{invalid:true}```' } } ] };
    expect(() => validateJsonFromAI(response)).toThrow(/Invalid JSON from AI/);
  });
});
