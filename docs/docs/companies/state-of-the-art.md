# State of the Art

We are often asked to explain why we are specifically building sign language technology,
given that large language models are currently improving rapidly.
Therefore, this document aims to provide a high-level overview of the current state of the art in popular vision-language models.

## Spoken to Signed Translation

While video generation models are still in the horizon, image generation models are already mature.
Thus, we start by testing image generation models to generate an image of a sign.

### OpenAI: [DALL-E 3](https://openai.com/index/dall-e-3/) via ChatGPT 4o

:::tip ChatGPT 4o Prompt
Sign language interpreter, green screen background, signing the American Sign Language sign for "House".
:::

To trigger DALL-E 3, ChatGPT 4o generates a new prompt:
:::info DALL-E 3 Prompt
A professional sign language interpreter signing the American Sign Language (ASL) sign for 'House' with clear and accurate hand positioning. The background is a plain green screen, suitable for chroma keying. The interpreter is dressed in neutral, professional attire, and the scene is well-lit to ensure clarity of the sign and facial expressions.
:::

![DALL-E 3 Image Generated using ChatGPT 4o Prompt](./examples/dall-e-3.webp)

The generated image is not a valid representation of the sign for "House".
The hands are with the wrong hand shapes, and they are not in the correct positions.

### StabilityAI: [Stable Diffusion 3.5 Large](https://huggingface.co/stabilityai/stable-diffusion-3.5-large)

:::info Prompt
Sign language interpreter, green screen background, signing the American Sign Language sign for "House".
:::

![Stable Diffusion 3.5 Large Image Generated using Prompt](./examples/stable-diffusion-3-5.jpeg)

The generated image is not a valid representation of the sign for "House".
The hands are with the wrong hand shapes, and they are not in the correct positions.

## Signed to Spoken Translation

### OpenAI

OpenAI does not currently support video inputs.

### Meta

Meta is conducting research on signed language translation, but their models are not publicly available.[^privacy-aware]
[^privacy-aware]: Rust et al. 2024. [Towards Privacy-Aware Sign Language Translation at Scale](https://arxiv.org/abs/2402.09611).

### Google

Google is conducting research on signed language translation, but their models are not publicly available.[^scaling-slt]
[^scaling-slt]: Zhang et al. 2024. [Scaling Sign Language Translation](https://arxiv.org/abs/2407.11855).

What is available, is [Gemini 1.5 Pro](https://console.cloud.google.com/vertex-ai/studio/freeform?model=gemini-1.5-pro-002), which is a general-purpose model which supports video inputs.

We attach a video of a woman signing "What is your name?"

:::info Prompt + Attached video "example-sentence.mp4"
Translate the attached American Sign Language video "example-sentence.mp4" into English.
:::

Responses:

1. The woman in the video signs the following: "I'm sorry, I don't understand."
2. The signer is saying: "Excuse me. I have a question."
3. The woman in the video signs the following: "Hello, my name is `[name]`. Nice to meet you."
4. The signer is saying: "Excuse me. Do you mind if I sit here?"
5. The signer is saying: "Excuse me. Do you have a second? Do you mind if I ask you a question?"
