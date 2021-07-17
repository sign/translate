# Sign Language Processing Playground

This playground is intended for ease of prototyping real-time sign language models.

[Visit the playground!](https://sign-language-processing.github.io/playground/)

It includes, as a basic first step, MediaPipe Holistic pose estimation, on top of which other predictions are performed:

- Sign language detection (Model based)
- SignWriting hand orientation (Rule based)
- SignWriting hand shape (Model based)
- Partial SignWriting non-manuals - eyebrows, eyes, mouthing (Model based)


# Sign Translate App

This app facilitates bi-directional multi-directional translation research, based on models from the playground.

[Visit the app!](https://sign-language-processing.github.io/playground/translate)

It includes:

- Desktop / Mobile ready UI
- Language selectors
- Translation direction selector


- Signed-to-spoken language translation
  - Camera / File upload video inputs
  - SignWriting hand shape and orientation estimation
  - SignWriting facial features estimation
  - Language identification (Detect Language) - **TODO**
  - Segmentation - **TODO**
  - Tokenization - **TODO**
  - SignWriting to spoken language translation - **TODO**
  - Text-to-speech - **TODO**
- Spoken-to-signed language translation
  - Text / Microphone inputs - **TODO**
  - Text-to-speech
  - Spoken language text to SignWriting translation - **TODO**
  - SignWriting to pose sequence - **TODO**
  - Pose sequence to video - **TODO**
  - Text to pose sequence (server side)
