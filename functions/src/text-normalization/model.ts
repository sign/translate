import type OpenAI from 'openai';
import type {ChatCompletionMessageParam} from 'openai/resources/chat/completions';

const SYSTEM_PROMPT = `
You are a proficient assistant, responsible for data sanitization for a machine translation model.
Your main task involves operating the \`normalize\` function:

  Normalizes the given text for sign language translation.

  Takes in a text that might contain misspellings, incorrect capitalization,
  missing hyphenation, numbers, units, or other phenomena requiring special
  vocalization. Returns the text normalized for sign language, with corrections in
  capitalization, spelling, and hyphenation, and special vocalizations for
  numbers and units. If the text can not be normalized, the function should return the original text.

  Parameters:
    - language_code (str): The language in which the text is in.
    - input_text (str): The text to be normalized.

  Returns:
    - str: The normalized text suitable for sign language.
`.trim();

const FEW_SHOTS = [
  {
    user: 'normalize("en", "hello")',
    assistant: 'Hello',
  },
  {
    user: 'normalize("en", "mjyti7fasodevwftxzdj")',
    assistant: 'mjyti7fasodevwftxzdj',
  },
  {
    user: 'normalize("en", "$123")',
    assistant: 'One hundred twenty-three dollars',
  },
  {
    // This example is used to tell the model it should not revert good normalizations
    user: 'normalize("en", "One hundred twenty-three dollars")',
    assistant: 'One hundred twenty-three dollars',
  },
  {
    user: 'normalize("en", "123 King Ave")',
    assistant: 'One two three King Avenue',
  },
  {
    user: 'normalize("de", "klein kinder essen pizza")',
    assistant: 'Kleine Kinder essen Pizza.',
  },
  {
    user: 'normalize("de", "Zwölftausend Dreihundert Fünfundvierzig")',
    assistant: 'zwölftausenddreihundertfünfundvierzig',
  },
  {
    user: 'normalize("en", "A important part of my life have been a people that stood by me.")',
    assistant: 'An important part of my life has been the people who stood by me.',
  },
];

const messages: ChatCompletionMessageParam[] = [{role: 'system', content: SYSTEM_PROMPT}];
for (const {user, assistant} of FEW_SHOTS) {
  messages.push({role: 'user', content: user});
  messages.push({role: 'assistant', content: assistant});
}

export class TextNormalizationModel {
  private client: OpenAI;

  constructor(private OpenAIApiKey: string) {
    const OpenAI = require('openai');
    this.client = new OpenAI({apiKey: this.OpenAIApiKey});
  }

  async normalize(lang: string, text: string): Promise<string | null> {
    const newMessage: ChatCompletionMessageParam = {role: 'user', content: `normalize("${lang}", "${text}")`};
    const chatCompletion = await this.client.chat.completions.create({
      messages: [...messages, newMessage],
      model: 'gpt-4o-mini',
      temperature: 0,
    });

    return chatCompletion.choices[0].message.content;
  }
}
