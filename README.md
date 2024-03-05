# 👋 LangNexus: Sign Translate

![Sign Translate](src/assets/promotional/about/hero.webp)

**Revolutionizing Sign Language Communication with Cutting-Edge Real-Time Translation Models.**

Enjoy seamless Sign Language Translation on desktop and mobile.

## Table of Contents 📖

- [Key Features](#key-features-🔑)
- [Development](#development-🔧)
  - [Prerequisites](#prerequisites-📋)
  - [Setting Up the Project](#setting-up-the-project-🚀)
- [Cite](#cite-📖)
- [Contributing](#contributing-🤝)
- [Issues](#issues-🐛)
- [Project Board](#project-board-📋)

## Key Features 🔑

### Sign Language Production

The following diagram illustrates the process of translating spoken language to sign language:

```
[Spoken Language Audio] ─────► [Human GAN] ─────► [Pose Sequence] ─────► [Skeleton Viewer] ─────► [3D Avatar]
                            │
                            └───► [Normalized Text] ─────► [SignWriting] ────► [Language Identification]
```

### Sign Language Translation

The following diagram illustrates the process of translating sign language to spoken language:

```
[Upload Sign Language Video] ───► [Segmentation] ───► [SignWriting]
                                                │
                                                └───► [Spoken Language Text] ───► [Spoken Language Audio]
```

## Development 🔧

### Prerequisites 📋

Before you begin, ensure you have met the following requirements:

- Install [Node.js](https://nodejs.org/) which includes [Node Package Manager (npm)](https://www.npmjs.com/get-npm).

### Setting Up the Project 🚀

To set up the project locally, follow these steps:

1. Clone the repository:

   ```bash
   git clone https://github.com/sign/translate.git
   ```

2. Navigate to the project directory:

   ```bash
   cd translate
   ```

3. Install dependencies:

   ```bash
   npm install
   ```

4. Run the application:

   ```bash
   npm start
   ```

## Cite 📖

If you find this project useful, consider citing it:

```bibtex
@misc{moryossef2023signmt,
    title={sign.mt: Effortless Real-Time Sign Language Translation},
    author={Moryossef, Amit},
    howpublished={\url{https://sign.mt/}},
    year={2023}
}
```

## Contributing 🤝

Contributions to this project are welcome! Please refer to our [Contribution Guidelines](https://github.com/sign/.github/blob/main/CONTRIBUTING.md) for more details.

## Issues 🐛

If you encounter any issues or have suggestions for improvements, please [submit an issue](https://github.com/sign/translate/issues).

## Project Board 📋

Check out our [Project Board](https://github.com/sign/translate/projects/1) to follow our progress and get involved in shaping the project's future.
