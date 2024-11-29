const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');
const deepmerge = require('deepmerge');
const {parse} = require('node-html-parser');

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

function replaceBranding(text) {
  return text.replace('Google', 'Sign').replace('GOOGLE', 'SIGN').replace('&#39;', "'").trim();
}

function checkDiff(a, b, path = '') {
  if (typeof a === 'object' && typeof b === 'object') {
    for (const key in a) {
      checkDiff(a[key], b[key], path + '.' + key);
    }
  } else {
    if (a !== b) {
      console.log(path, a, b);
    }
  }
}

async function applyGoogleLanguage(language, filePath) {
  // console.log({language});

  const main = await getMainPage(language);
  const mainEl = parse(main);
  const about = await getAboutPage(language);
  const aboutEl = parse(about);

  let index = {};
  if (fs.existsSync(filePath)) {
    index = JSON.parse(String(fs.readFileSync(filePath)));
  }

  const inputButton = icon => new RegExp(`<i.*?>${icon}</i><span.*?>(.*?)</span>`, 'g').exec(main)[1];

  const [_, ctrl, shift, swapLanguages] =
    /[(（]„?(Ctrl|Befehlstaste|Strg|Ktrl|Cmd)\s?\+\s?(Shift|vaihto|Umschalttaste|Maj|Mayús|Maius|Maiús|mayúscula|MAIUSC|Üst Karakter|Skift)\s?\+\s?S\s?.*?[)）].*?jsslot.*?jsslot>(.*?)[(（]/gi.exec(
      main
    );

  //
  // // let [_1, uploadTypes, browseComputer] = /class="uqt39c">(.*?)<.*?sSlcId.*?>(.*?)</g.exec(main);
  // // uploadTypes = uploadTypes
  // //   .trim()
  // //   .replace('docx', 'mp4')
  // //   .replace('DOCX', 'MP4')
  // //   .replace('pdf', 'ogv')
  // //   .replace('PDF', 'OGV')
  // //   .replace(', .pptx', '')
  // //   .replace(', .PPTX', '')
  // //   .replace('xlsx', 'webm')
  // //   .replace('XLSX', 'WEBM')
  // //   .replace(/[,、]? ?.?PPTX/i, '');

  const extraSuggestion = {
    keyboard: {
      ctrl: ctrl.trim(),
      shift: shift.trim(),
    },
    translate: {
      title: replaceBranding(mainEl.querySelector('title').innerText),
      'language-selector': {
        detected: '{{lang}}',
      },
    },
  };
  const extraForce = {
    landing: {
      try: replaceBranding(aboutEl.querySelector('header a.glue-button').innerText),
    },
    settings: {
      support: {
        feedback: {
          send: mainEl.querySelector('a[jsname="N7Eqid"]').textContent.trim(),
        },
      },
    },
    translate: {
      input: {
        text: mainEl.querySelector('.U0xwnf span[jsname="V67aGc"]').textContent.trim(),
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
      // upload: {
      //   types: uploadTypes,
      //   browse: browseComputer,
      // },
    },

    'text-to-speech': {
      play: mainEl.querySelector('#ucj-11').textContent.trim(),
      //   "cancel": "Stop", // TODO from js
      //   "unavailable": "Voice output isn't available for the selected language" // TODO from js
    },
  };

  const startSpeechToText = mainEl.querySelector('#tt-i23');
  if (startSpeechToText) {
    extraForce['speech-to-text'] = {
      start: startSpeechToText.textContent.trim(),
    };
  } else {
    console.log('Speech to text not found');
  }

  index = deepmerge(deepmerge(extraSuggestion, index), extraForce);

  // console.log(language, extraSuggestion, extraForce);
  checkDiff(extraSuggestion, index);

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
