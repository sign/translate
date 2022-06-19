import {exec} from 'child_process';
import {project} from './project';

await project.android.incrementVersionCode();
await project.ios.incrementBuild();

await project.commit();

exec(`git add android/app/build.gradle ios/App/App.xcodeproj/project.pbxproj`);
