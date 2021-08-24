[![Client Build Test Status](https://github.com/sign-language-processing/playground/actions/workflows/build_client.yml/badge.svg)](https://github.com/sign-language-processing/playground/actions/workflows/build_client.yml)
[![Coverage Status](https://coveralls.io/repos/github/sign-language-processing/playground/badge.svg?branch=master)](https://coveralls.io/github/sign-language-processing/playground?branch=master)
[![MIT license](https://img.shields.io/badge/License-MIT-blue.svg)](https://github.com/sign-language-processing/playground/blob/master/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sign-language-processing/playground/issues)



# [👋 Sign Translate](https://sign.mt/)

A bi-directional multilingual translation app for desktop and mobile, 
based on state-of-the-art real-time client side models.

#### Signed-to-spoken language translation
- Camera / File upload video inputs
- SignWriting hand shape and orientation estimation
- SignWriting facial features estimation
- Language identification (Detect Language) - **TODO**
- Segmentation - **TODO**
- Tokenization - **TODO**
- SignWriting to spoken language translation - **TODO**
- Text-to-speech
- Copy / share / edit translation - **TODO**

#### Spoken-to-signed language translation
- Text input
- [Microphone input](https://github.com/sign-language-processing/playground/issues/9)
- Text-to-speech
- Language identification (Detect Language)
- [Spoken language text to SignWriting translation](https://github.com/sign-language-processing/playground/issues/11)
- [SignWriting to pose sequence](https://github.com/sign-language-processing/sign-translate/issues/15)
- Text to pose sequence (server side) - To be removed
- Pose sequence to video
- Copy / share / download translation

# Sign Language Processing Playground

This playground is intended for ease of prototyping real-time sign language models.

[Visit the playground!](https://sign-language-processing.github.io/playground/)


It includes, as a basic first step, MediaPipe Holistic pose estimation, on top of which other predictions are performed:

- Sign language detection (Model based)
- SignWriting hand orientation (Rule based) - https://github.com/sign-language-processing/playground/issues/1
- SignWriting hand shape (Model based)
- Partial SignWriting non-manuals - eyebrows, eyes, mouthing (Model based)


