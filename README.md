<h1 align="center">👋 Sign Translate</h1>

<p align="center">
  <i>
    Sign Translate is a web-based application for real-time multilingual sign language translation.
    <br>
    Built for desktop and mobile, based on state-of-the-art client side models.
  </i>
</p>

<p align="center">
  <a href="https://sign.mt/"><strong>sign.mt</strong></a>
  <br>
</p>

<p align="center">
  <a href="https://github.com/sign/.github/blob/main/CONTRIBUTING.md">Contributing Guidelines</a>
  ·
  <a href="https://github.com/sign/translate/issues">Submit an Issue</a>
</p>

<p align="center">
  <a href="https://github.com/sign/translate/actions/workflows/client.yml">
    <img src="https://github.com/sign/translate/actions/workflows/client.yml/badge.svg" alt="Client Build Test Status" />
  </a>
  <a href="https://coveralls.io/github/sign/translate?branch=master">
    <img src="https://coveralls.io/repos/github/sign/translate/badge.svg?branch=master" alt="Coverage Status" />
  </a>
  <a href="https://github.com/sign/translate/blob/master/LICENSE.md">
    <img src="https://img.shields.io/badge/License-CC%20BY--NC--SA%204.0-lightgrey.svg" alt="License: CC BY-NC-SA 4.0" />
  </a>
</p>

<p align="center">
  <a href="https://github.com/sign/translate/stargazers" target="_blank">
    <img src="https://img.shields.io/github/stars/sign/translate" alt="github Stars" />
  </a>
  <a href="https://github.com/sign/translate/network/members" target="_blank">
    <img src="https://img.shields.io/github/forks/sign/translate" alt="github Forks" />
  </a>
  <a href="https://github.com/sign/translate/stargazers" target="_blank">
    <img src="https://img.shields.io/github/contributors/sign/translate" alt="github Contributors" />
  </a>
  <a href="https://github.com/sign/translate/issues" target="_blank">
    <img src="https://img.shields.io/github/issues/sign/translate" alt="github Issues" />
  </a>
</p>

<p align="center">

  <a href="https://sign.mt" target="_blank">
    <img src="src/assets/promotional/about/hero.webp" alt="Translation Demo" />
  </a>
</p>

<hr>

## Key Features

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

## Development Setup

### Prerequisites

- Install [Node.js] which includes [Node Package Manager][npm]

### Setting Up the Project

Install dependencies locally:

```
npm install
```

Run the application:

```
npm start
```

Test the application:

```
npm test
```

### Want to Help?

Want to report a bug, contribute some code, or improve documentation? Excellent!
Read up on our guidelines for [contributing][contributing] and then check out one of our issues labeled as <kbd>[help wanted](https://github.com/sign/translate/labels/help%20wanted)</kbd> or <kbd>[good first issue](https://github.com/sign/translate/labels/good%20first%20issue)</kbd>.

**Find this useful? Give our repo a star :star: :arrow_up:.**

[![Stargazers repo roster for @sign/translate](https://reporoster.com/stars/sign/translate)](https://github.com/sign/translate/stargazers)

[node.js]: https://nodejs.org/
[npm]: https://www.npmjs.com/get-npm
[contributing]: https://github.com/sign/.github/blob/main/CONTRIBUTING.md
