const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');

async function getPage(url, name) {
  const cachePath = 'cache/' + name;
  if (!fs.existsSync(cachePath)) {
    const res = await fetch(url);
    const text = await res.text();
    fs.writeFileSync(cachePath, text);
  }

  return String(fs.readFileSync(cachePath))
    .replace(/&nbsp;/g, ' ')
    .replace(/ /g, ' ')
    .replace(/\u00A0/g, ' ');
}

async function getMainPage(lang) {
  const url = `https://translate.google.com/?hl=${lang}`;
  const name = `main-${lang}.html`;
  return getPage(url, name);
}

async function getAboutPage(lang) {
  const url = `https://translate.google.com/about/?hl=${lang}`;
  const name = `about-${lang}.html`;
  return getPage(url, name);
}

async function getAvailableLanguages() {
  const text = await getAboutPage('en');

  const matches = [...text.matchAll(/<option value="\/intl\/(.*?)\//g)];
  return matches.map(m => m[1]);
}

// function extract(text, attribute, value) {
//   const exp = new RegExp(`${attribute}="${value}".*?>(.*?)<`, 'gi');
//   console.log(exp);
//   console.log(text.match(exp));
//   return text.match(exp)[6];
// }

async function applyGoogleLanguage(language, filePath) {
  console.log({language});

  const main = await getMainPage(language);
  const about = await getAboutPage(language);

  let index = {};
  if (fs.existsSync(filePath)) {
    index = JSON.parse(String(fs.readFileSync(filePath)));
  }

  const inputButton = icon => new RegExp(`<i.*?>${icon}</i><span.*?>(.*?)</span>`, 'g').exec(main)[1];

  const [_, ctrl, shift, swapLanguages] =
    /[(（]„?(Ctrl|Befehlstaste|Strg|Ktrl|Cmd)\s?\+\s?(Shift|vaihto|Umschalttaste|Maj|Mayús|Maius|Maiús|mayúscula|MAIUSC|Üst Karakter|Skift)\s?\+\s?S\s?.*?[)）].*?jsslot.*?jsslot>(.*?)[(（]/gi.exec(
      main
    );

  let [_1, uploadTypes, browseComputer] = /class="TEGJAb">(.*?)<.*?sSlcId.*?>(.*?)</g.exec(main);
  uploadTypes = uploadTypes
    .trim()
    .replace('docx', 'mp4')
    .replace('DOCX', 'MP4')
    .replace('pdf', 'ogv')
    .replace('PDF', 'OGV')
    .replace('xlsx', 'webm')
    .replace('XLSX', 'WEBM')
    .replace(/[,、]? ?.?PPTX/i, '');

  const [aboutTitle, languagesTitle, contributeTitle, toolsTitle] = [
    ...about.matchAll(/h-c-header__nav-li-link.*?"\s*title="(.*?)"/g),
  ].map(m => m[1]);
  const [privacyTitle, termsTitle, licensesTitle] = [
    ...about.matchAll(/class="h-c-footer__link"[\s\S]*?>\s*(.*?)\s*</g),
  ]
    .map(m => m[1])
    .slice(5);

  let tryButton = /<a href="https:\/\/translate\.google\.com.*?"\s*title="(.*?)"/.exec(about)[1];
  tryButton = tryButton.replace('Google', 'Sign').replace('GOOGLE', 'SIGN');

  const extraSuggestion = {
    keyboard: {
      ctrl: ctrl.trim(),
      shift: shift.trim(),
    },
    translate: {
      title: /<title>(.*?)<\/title>/g.exec(main)[1].replace('Google', 'Sign').replace('&#39;', "'"),
      'language-selector': {
        detected: '{{lang}}',
      },
    },
    landing: {
      try: tryButton,
    },
  };
  const extraForce = {
    translate: {
      feedback: /aria-haspopup="dialog".*?>(.*?)</g.exec(main)[1].trim(),
      input: {
        text: inputButton('translate'),
      },
      swapLanguages: swapLanguages.trim(),

      'language-selector': {
        detect: /\[\[\["auto","(.*?)"]/g.exec(main)[1],
        // "detected": "{lang} - Detected" // TODO get from a js file?
      },
      // "spoken-to-signed": {
      //   "actions": {
      //     "copy": "Copy Translation", // TODO get from a js file?
      //     "share": "Share Translation" // TODO get from a js file?
      // Download can be "Save translation" // TODO from main
      //   }
      // },
      upload: {
        types: uploadTypes,
        browse: browseComputer,
      },
    },

    'text-to-speech': {
      play: /"suEOdc">(.*?)</g.exec(main)[1],
      //   "cancel": "Stop", // TODO from js
      //   "unavailable": "Voice output isn't available for the selected language" // TODO from js
    },
    'speech-to-text': {
      start:
        /jsaction="click:cOuCgd; mousedown:UX7yZ; mouseup:lbsD7e; mouseenter:tfO1Yc; mouseleave:JywGue; touchstart:p6p2H; touchmove:FwuNnf; touchend:yfqBxc; touchcancel:JMtRjd; focus:AHmuwe; blur:O22p3e; contextmenu:mg9Pef;mlnRJb:fLiPzd;" data-disable-idom="true" disabled aria-label="(.*?)"/g.exec(
          main
        )[1],
      //   "stop": "Stop translation by voice",
      //   "not-allowed": "Need permission to use microphone",
      //   "language-not-supported": "Selected language is not supported",
      //   "browser-not-supported": "Voice input isn't supported on this browser"
    },
    landing: {
      about: {
        title: aboutTitle,
      },
      languages: {
        title: languagesTitle,
      },
      contribute: {
        title: contributeTitle,
      },
      tools: {
        title: toolsTitle,
      },
    },
    legal: {
      terms: {
        title: termsTitle,
      },
      privacy: {
        title: privacyTitle,
      },
      licenses: {
        title: licensesTitle,
      },
    },
  };

  index = deepmerge(deepmerge(extraSuggestion, index), extraForce);

  console.log(language, extraSuggestion, extraForce);

  fs.writeFileSync(filePath, JSON.stringify(index, null, 2) + '\n');
}

async function main() {
  const langsDir = path.join(__dirname, '..', 'src', 'assets', 'i18n');

  if (!fs.existsSync('cache')) {
    fs.mkdirSync('cache');
  }

  const languages = await getAvailableLanguages();
  for (const language of languages.sort()) {
    const fName = language === 'iw' ? 'he' : language.toLowerCase();
    await applyGoogleLanguage(language, path.join(langsDir, `${fName}.json`));
  }
}

main().then(() => process.exit(0));
