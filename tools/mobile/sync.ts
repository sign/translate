import capacitorConfig from '../../capacitor.config';
import * as xpackage from '../../package.json';
import {project} from './project';
import * as fs from 'fs';
import {WebAppManifest} from 'web-app-manifest';

await project.android.setPackageName(capacitorConfig.appId);
await project.android.setVersionName(xpackage.version);

for (const build of ['Debug', 'Release']) {
  await project.ios.setBundleId('App', build, capacitorConfig.appId);
  await project.ios.setVersion('App', build, xpackage.version);
}

await project.commit();

// Web config
const webManifestPath = 'src/manifest.webmanifest';
const webManifest: WebAppManifest = JSON.parse(String(fs.readFileSync(webManifestPath)));
webManifest.name = capacitorConfig.appName;
fs.writeFileSync(webManifestPath, JSON.stringify(webManifest, null, 2));
