const fetch = require('node-fetch');
const path = require('path');
const fs = require('fs');

const DEFAULT_LANGUAGE = 'en';

const baseDir = __dirname + `${path.sep}..${path.sep}`;
const langsDir = `${baseDir}src${path.sep}assets${path.sep}i18n`;

// Load language files
const languages = {};
for (const file of fs.readdirSync(langsDir)) {
  const [lang] = file.split('.');
  const filePath = langsDir + path.sep + file;
  languages[lang] = {
    filePath,
    content: JSON.parse(String(fs.readFileSync(filePath))),
  };
}

async function translate(text, sourceLanguage, targetLanguage) {
  console.log('translate', {text, sourceLanguage, targetLanguage});
  const requestStr = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=${sourceLanguage}&tl=${targetLanguage}&dt=t&q=${encodeURIComponent(
    text
  )}`;

  const req = await fetch(requestStr);
  const json = await req.json();
  return json[0][0][0];
}

async function translateMissingEntries(source, target, targetLanguage) {
  for (const [key, value] of Object.entries(source)) {
    if (!(key in target)) {
      if (typeof value === 'string') {
        target[key] = await translate(value, DEFAULT_LANGUAGE, targetLanguage);
      } else {
        target[key] = {};
        await translateMissingEntries(value, target[key], targetLanguage);
      }
    } else {
      if (typeof value !== 'string') {
        await translateMissingEntries(value, target[key], targetLanguage);
      }
    }
  }
}

function removeExtraEntries(source, target) {
  for (const [key, value] of Object.entries(target)) {
    if (!(key in source)) {
      delete target[key];
    } else {
      if (typeof value !== 'string') {
        removeExtraEntries(source[key], value);
      }
    }
  }
}

async function main() {
  // Iterate files and translate missing entries
  for (const [lang, {content, filePath}] of Object.entries(languages)) {
    if (lang !== DEFAULT_LANGUAGE) {
      const source = languages[DEFAULT_LANGUAGE].content;
      await translateMissingEntries(source, content, lang);
      removeExtraEntries(source, content);
      fs.writeFileSync(filePath, JSON.stringify(content, null, 2) + '\n');
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));

/** NOTE!
 For spoken languages, go to Google Translate (https://translate.google.com/?hl=iw)
 And get all their names:

 const langs = {};
 Array.from($0.querySelectorAll("div[data-language-code]")).forEach(n => {
  langs[n.getAttribute("data-language-code")] = n.children[1].innerText.trim();
 });
 JSON.stringify(langs);
 **/
