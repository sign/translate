[![Client Build Test Status](https://github.com/sign-language-processing/playground/actions/workflows/build_client.yml/badge.svg)](https://github.com/sign-language-processing/playground/actions/workflows/build_client.yml)
[![Coverage Status](https://coveralls.io/repos/github/sign-language-processing/playground/badge.svg?branch=master)](https://coveralls.io/github/sign-language-processing/playground?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sign-language-processing/playground/blob/master/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sign-language-processing/playground/issues)



# Sign Translate App

This app facilitates bi-directional multi-directional translation research, based on models from the playground.

[Visit the app!](https://sign-language-processing.github.io/playground/translate)

#### Including:

- Desktop / Mobile ready UI
- Language selectors
- Translation direction selector
- Signed-to-spoken language translation
- Spoken-to-signed language translation

#### Signed-to-spoken language translation
- Camera / File upload video inputs
- SignWriting hand shape and orientation estimation
- SignWriting facial features estimation
- Language identification (Detect Language) - **TODO**
- Segmentation - **TODO**
- Tokenization - **TODO**
- SignWriting to spoken language translation - **TODO**
- Text-to-speech

#### Spoken-to-signed language translation
- Text input
- Microphone input - **TODO**
- Text-to-speech
- Spoken language text to SignWriting translation - **TODO**
- SignWriting to pose sequence - **TODO**
- Pose sequence to video - **TODO** (https://github.com/tensorflow/tfjs/issues/5374)
- Text to pose sequence (server side)

#### Mobile support - TODOs
- Rethink app icon
- Prevent iOS rubberband scrolling
- MediaPipe doesn't work on mobile (https://github.com/google/mediapipe/issues/1427)



# Sign Language Processing Playground

This playground is intended for ease of prototyping real-time sign language models.

[Visit the playground!](https://sign-language-processing.github.io/playground/)


It includes, as a basic first step, MediaPipe Holistic pose estimation, on top of which other predictions are performed:

- Sign language detection (Model based)
- SignWriting hand orientation (Rule based)
- SignWriting hand shape (Model based)
- Partial SignWriting non-manuals - eyebrows, eyes, mouthing (Model based)
