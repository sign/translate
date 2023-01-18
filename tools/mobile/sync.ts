import capacitorConfig from '../../capacitor.config';
import * as xpackage from '../../package.json';
import {project} from './project';
import * as fs from 'fs';
import {WebAppManifest} from 'web-app-manifest';

async function main() {
  await project.load();

  await project.android.setPackageName(capacitorConfig.appId);
  await project.android.setVersionName(xpackage.version);
  const [major, minor, patch] = xpackage.version.split('.').map(Number);
  await project.android.setVersionCode(major * 10000 + minor * 100 + patch);
  await project.android.setAppName(capacitorConfig.appName);

  for (const build of ['Debug', 'Release']) {
    await project.ios.setBundleId('App', build, capacitorConfig.appId);
    await project.ios.setVersion('App', build, xpackage.version);
    await project.ios.setDisplayName('App', build, capacitorConfig.appName);
  }

  await project.commit();

  // Web config
  const webManifestPath = 'src/manifest.webmanifest';
  const webManifest: WebAppManifest = JSON.parse(String(fs.readFileSync(webManifestPath)));
  webManifest.name = capacitorConfig.appName;
  fs.writeFileSync(webManifestPath, JSON.stringify(webManifest, null, 2));
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
