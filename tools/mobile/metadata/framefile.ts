import * as fs from 'fs';
import {promisify} from 'util';
import {execSync} from 'child_process';

const frameFile = {
  device_frame_version: 'latest',
  default: {
    title: {
      font_size: 128,
      color: '#545454',
    },
    keyword: {
      font_size: 128,
      color: '#545454',
    },
    background: './background.jpeg',
    padding: 50,
    show_complete_frame: false,
    stack_title: false,
    title_below_image: false,
    frame: 'WHITE',
    use_platform: 'IOS',
  },
  data: [
    {
      filter: 'main',
      keyword: {
        color: '#d21559',
      },
    },
  ],
};

async function generateFrameFiles() {
  const platforms = {
    IOS: 'ios/App/fastlane/screenshots',
    ANDROID: 'android/fastlane/metadata/android',
  };

  for (const [platform, path] of Object.entries(platforms)) {
    frameFile.default.use_platform = platform;
    await promisify(fs.writeFile)(`${path}/Framefile.json`, JSON.stringify(frameFile, null, 2));
    execSync(`convert -size 2048x1536 canvas:white ${path}/background.jpeg`);
  }
}

export async function frameScreenshots() {
  await generateFrameFiles();
  // Frame about screenshots
  execSync('fastlane run frameit path:"../src/assets/promotional/about/android" use_platform:"ANDROID"', {
    cwd: 'android',
    encoding: 'utf8',
    stdio: 'inherit',
  });
  execSync('fastlane run frameit path:"../../src/assets/promotional/about/iphone" use_platform:"IOS"', {
    cwd: 'ios/App',
    encoding: 'utf8',
    stdio: 'inherit',
  });
  // Frame store screenshots
  execSync('fastlane frameit_screenshots', {cwd: 'android', encoding: 'utf8', stdio: 'inherit'});
  execSync('fastlane frameit_screenshots', {cwd: 'ios/App', encoding: 'utf8', stdio: 'inherit'});
}

export async function screenshotFrameLocales(fResolver: any) {
  // TODO generate local texts
  await Promise.all([
    promisify(fs.writeFile)(fResolver('title.strings'), ['"main" = "sign language";'].join('\n')),
    promisify(fs.writeFile)(fResolver('keyword.strings'), ['"main" = "TRANSLATE";'].join('\n')),
  ]);
}

export async function aboutScreenshotsWebp(dirPath: string) {
  console.log('Converting screenshots to WebP', dirPath);
  const framedFiles = fs.readdirSync(dirPath).filter(f => f.endsWith('_framed.png'));

  for (const file of framedFiles) {
    const webpFile = file.slice(0, -'png'.length) + 'webp';
    if (fs.existsSync(webpFile)) {
      fs.unlinkSync(webpFile);
    }
    execSync(`magick ${file} ${webpFile}`, {cwd: dirPath, encoding: 'utf8', stdio: 'inherit'});
  }
}
