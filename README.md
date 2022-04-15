[![Client Build Test Status](https://github.com/sign/translate/actions/workflows/client.yml/badge.svg)](https://github.com/sign/translate/actions/workflows/client.yml)
[![Coverage Status](https://coveralls.io/repos/github/sign/translate/badge.svg?branch=master)](https://coveralls.io/github/sign/translate?branch=master)
[![License: GPL v3](https://img.shields.io/badge/License-GPLv3-blue.svg)](https://github.com/sign/translate/blob/master/LICENSE)
[![Contributions Welcome](https://img.shields.io/badge/contributions-welcome-brightgreen.svg?style=flat)](https://github.com/sign/translate/issues)



# [👋 Sign Translate](https://sign.mt/)

A bi-directional multilingual translation app for desktop and mobile, 
based on state-of-the-art real-time client side models.

### Key Features

(Hyperlinks to issues indicate the feature does not exist fully)

#### Spoken-to-signed language translation

```
┌─────────────────────┐
│Spoken Language Audio│                                        ┌─────────┐
└─────────┬───────────┘                            ┌──────────►│Human GAN│
          │                                        │           └─────────┘
          ▼                                        │
┌────────────────────┐     ┌───────────┐    ┌──────┴──────┐    ┌───────────────┐
│Spoken Language Text├────►│SignWriting├───►│Pose Sequence├───►│Skeleton Viewer│
└─────────┬──────────┘     └───────────┘    └──────┬──────┘    └───────────────┘
          │                      ▲                 │
          ▼                      │                 │           ┌────────────────┐
┌───────────────────────┐        │                 └──────────►│Avatar Animation│
│Language Identification├────────┘                             └────────────────┘
└───────────────────────┘
```

- Text / Microphone inputs
- Text-to-speech
- Spoken Language identification (Detect Language)
- Spoken language text to SignWriting translation
- [SignWriting to pose sequence](https://github.com/sign/translate/issues/15)
- Text to pose sequence fallback (server side)
- Skeleton / [Avatar](https://github.com/sign/translate/issues/16) / Human Pose Viewers
- Copy / share / download video

#### Signed-to-spoken language translation

```
┌──────────────────────────┐                                ┌────────────────────┐
│Upload Sign Language Video│                      ┌────────►│Spoken Language Text│
└──────────┬───────────────┘                      │         └──────────┬─────────┘
           │                                      │                    │
           │          ┌────────────┐       ┌──────┴────┐               │
           ├─────────►│Segmentation├──────►│SignWriting│               │
           │          └────────────┘       └───────────┘               │
           │                                                           ▼
┌──────────┴────────────────┐                               ┌─────────────────────┐
│Camera Sign Language Video │                               │Spoken Language Audio│
└───────────────────────────┘                               └─────────────────────┘
```

- Camera / File upload video inputs
- SignWriting hand shape and [orientation](https://github.com/sign/translate/issues/1) estimation
- SignWriting facial features estimation
- [Signed Language identification (Detect Language)](https://github.com/sign/translate/issues/21)
- [Segmentation]() - **TODO CREATE ISSUE**
- [Tokenization]() - **TODO CREATE ISSUE**
- [SignWriting to spoken language translation](https://github.com/sign/translate/issues/18)
- Text-to-speech
- [Copy / share translation](https://github.com/sign/translate/issues/19)
