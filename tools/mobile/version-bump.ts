import {exec} from 'child_process';
import {project} from './project';

async function main() {
  await project.load();
  await project.android.incrementVersionCode();
  await project.ios.incrementBuild();

  await project.commit();

  exec(`git add android/app/build.gradle ios/App/App.xcodeproj/project.pbxproj`);
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });
