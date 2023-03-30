import {Component, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';
import {AssetState} from '../../../core/services/assets/assets.service';
import {MatTreeNestedDataSource} from '@angular/material/tree';

interface PackagesParent {
  name: string;
  children: AssetState[];
}

interface PackageLicense {
  name: string;
  licenses: string;
  repository: string;
  licenseUrl: string;
}

type Node = PackagesParent | PackageLicense;

@Component({
  selector: 'app-licenses',
  templateUrl: './licenses.component.html',
  styleUrls: ['./licenses.component.scss'],
})
export class LicensesComponent implements OnInit {
  treeControl = new NestedTreeControl<Node>((node: any) => node.children);
  filesTree = new MatTreeNestedDataSource<Node>();

  constructor(private httpClient: HttpClient) {}

  ngOnInit(): void {
    // this.httpClient.get('/licenses.json').subscribe((licenses: any) => {
    //   this.updateTree(licenses);
    // });
    this.updateTree({
      '@angular/animations@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/cdk@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/components',
        licenseUrl: 'https://github.com/angular/components/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@angular/common@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/compiler@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/core@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/forms@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/material@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/components',
        licenseUrl: 'https://github.com/angular/components/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@angular/platform-browser-dynamic@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/platform-browser@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/platform-server@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/router@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@angular/service-worker@15.2.3': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular',
        parents: '@sign/translate',
      },
      '@asymmetrik/ngx-leaflet@15.0.1': {
        licenses: 'MIT',
        repository: 'https://github.com/bluehalo/ngx-leaflet',
        licenseUrl: 'https://github.com/bluehalo/ngx-leaflet/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor-firebase/analytics@1.3.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/capawesome-team/capacitor-firebase',
        licenseUrl: 'https://github.com/capawesome-team/capacitor-firebase/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor-firebase/app@1.3.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/capawesome-team/capacitor-firebase',
        licenseUrl: 'https://github.com/capawesome-team/capacitor-firebase/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor-firebase/crashlytics@1.3.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/capawesome-team/capacitor-firebase',
        licenseUrl: 'https://github.com/capawesome-team/capacitor-firebase/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor-firebase/performance@1.3.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/capawesome-team/capacitor-firebase',
        licenseUrl: 'https://github.com/capawesome-team/capacitor-firebase/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/android@4.7.1': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor',
        licenseUrl: 'https://github.com/ionic-team/capacitor/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/core@4.7.1': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor',
        licenseUrl: 'https://github.com/ionic-team/capacitor/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/filesystem@4.1.4': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor-plugins',
        licenseUrl: 'https://github.com/ionic-team/capacitor-plugins/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/ios@4.7.1': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor',
        licenseUrl: 'https://github.com/ionic-team/capacitor/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/keyboard@4.1.1': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor-plugins',
        licenseUrl: 'https://github.com/ionic-team/capacitor-plugins/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/share@4.1.1': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor-plugins',
        licenseUrl: 'https://github.com/ionic-team/capacitor-plugins/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@capacitor/splash-screen@4.2.0': {
        licenses: 'MIT',
        repository: 'https://github.com/ionic-team/capacitor-plugins',
        licenseUrl: 'https://github.com/ionic-team/capacitor-plugins/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@google/model-viewer@3.0.2': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/google/model-viewer',
        licenseUrl: 'https://github.com/google/model-viewer/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@mediapipe/drawing_utils@0.3.1675466124': {
        licenses: 'Apache-2.0',
        licenseUrl: 'https://google.github.io/mediapipe/solutions',
        parents: '@sign/translate',
      },
      '@mediapipe/holistic@0.5.1675471629': {
        licenses: 'Apache-2.0',
        licenseUrl: 'https://google.github.io/mediapipe/solutions/holistic',
        parents: '@sign/translate',
      },
      '@ngneat/transloco@4.2.6': {
        licenses: 'MIT',
        repository: 'https://github.com/ngneat/transloco',
        licenseUrl: 'https://github.com/ngneat/transloco/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@nguniversal/express-engine@15.2.0': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/universal',
        licenseUrl: 'https://github.com/angular/universal',
        parents: '@sign/translate',
      },
      '@ngxs/store@3.7.6-dev.master-94b06c2': {
        licenses: 'MIT',
        repository: 'https://github.com/ngxs/store',
        licenseUrl: 'https://github.com/ngxs/store',
        parents: '@sign/translate',
      },
      '@sign-mt/browsermt@0.2.1': {
        licenses: 'UNKNOWN',
        repository: 'https://github.com/sign/browsermt',
        licenseUrl: 'https://github.com/sign/browsermt',
        parents: '@sign/translate',
      },
      '@sutton-signwriting/font-ttf@1.5.0': {
        licenses: 'MIT',
        repository: 'https://github.com/sutton-signwriting/font-ttf',
        licenseUrl: 'https://github.com/sutton-signwriting/font-ttf/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@sutton-signwriting/sgnw-components@1.1.0': {
        licenses: 'MIT',
        repository: 'https://github.com/sutton-signwriting/sgnw-components',
        licenseUrl: 'https://github.com/sutton-signwriting/sgnw-components/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-backend-wasm@4.2.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-backend-webgl@4.2.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-backend-webgpu@0.0.1-alpha.17': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-converter@4.2.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-core@4.2.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs-layers@4.2.0': {
        licenses: 'Apache-2.0 AND MIT',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      '@tensorflow/tfjs@4.2.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/tensorflow/tfjs',
        licenseUrl: 'https://github.com/tensorflow/tfjs',
        parents: '@sign/translate',
      },
      'base64-blob@1.4.1': {
        licenses: 'MIT',
        repository: 'https://github.com/livelybone/base64-blob',
        licenseUrl: 'https://github.com/livelybone/base64-blob/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'capacitor-blob-writer@1.1.9': {
        licenses: 'MIT',
        repository: 'https://github.com/diachedelic/capacitor-blob-writer',
        licenseUrl: 'https://github.com/diachedelic/capacitor-blob-writer/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'cld3-asm@3.1.1': {
        licenses: 'MIT',
        repository: 'https://github.com/kwonoj/cld3-asm',
        licenseUrl: 'https://github.com/kwonoj/cld3-asm/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'comlink@4.4.1': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/GoogleChromeLabs/comlink',
        licenseUrl: 'https://github.com/GoogleChromeLabs/comlink/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'filesize@9.0.11': {
        licenses: 'BSD-3-Clause',
        repository: 'https://github.com/avoidwork/filesize.js',
        licenseUrl: 'https://github.com/avoidwork/filesize.js/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'firebase@9.18.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/firebase/firebase-js-sdk',
        licenseUrl: 'https://github.com/firebase/firebase-js-sdk',
        parents: '@sign/translate',
      },
      'flag-icons@6.6.6': {
        licenses: 'MIT',
        repository: 'http://github.com/lipis/flag-icons',
        licenseUrl: 'http://github.com/lipis/flag-icons/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'leaflet@1.9.3': {
        licenses: 'BSD-2-Clause',
        repository: 'https://github.com/Leaflet/Leaflet',
        licenseUrl: 'https://github.com/Leaflet/Leaflet/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'ngx-filesize@3.0.1': {
        licenses: 'MIT',
        repository: 'github:amitdahan/ngx-filesize',
        licenseUrl: 'github:amitdahan/ngx-filesize',
        parents: '@sign/translate',
      },
      'pose-viewer@0.6.2': {
        licenses: 'MIT',
        parents: '@sign/translate',
      },
      'rxjs@7.8.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/reactivex/rxjs',
        licenseUrl: 'https://github.com/reactivex/rxjs/raw/master/LICENSE.txt',
        parents: '@sign/translate',
      },
      'stats.js@0.17.0': {
        licenses: 'MIT',
        repository: 'https://github.com/mrdoob/stats.js',
        licenseUrl: 'https://github.com/mrdoob/stats.js/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'three@0.150.1': {
        licenses: 'MIT',
        repository: 'https://github.com/mrdoob/three.js',
        licenseUrl: 'https://github.com/mrdoob/three.js/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'tslib@2.5.0': {
        licenses: '0BSD',
        repository: 'https://github.com/Microsoft/tslib',
        licenseUrl: 'https://github.com/Microsoft/tslib/raw/master/LICENSE.txt',
        parents: '@sign/translate',
      },
      'web-vitals@3.3.0': {
        licenses: 'Apache-2.0',
        repository: 'https://github.com/GoogleChrome/web-vitals',
        licenseUrl: 'https://github.com/GoogleChrome/web-vitals/raw/master/LICENSE',
        parents: '@sign/translate',
      },
      'zone.js@0.13.0': {
        licenses: 'MIT',
        repository: 'https://github.com/angular/angular',
        licenseUrl: 'https://github.com/angular/angular/raw/master/LICENSE',
        parents: '@sign/translate',
      },
    });
  }

  updateTree(packages: {[key: string]: any}) {
    for (const [name, info] of Object.entries(packages)) {
      info.name = name;
      if (name.startsWith('@')) {
        const [scope, packageName] = name.split('/');
        if (!packages[scope]) {
          packages[scope] = {name: `${scope}/`, children: []};
        }
        packages[scope].children.push({...info, name: packageName});
        delete packages[name];
      }
    }

    const nodes = Object.values(packages).sort((a, b) => a.name.localeCompare(b.name));
    this.filesTree.data = this.treeControl.dataNodes = nodes;
    this.treeControl.expandAll();
  }

  hasChildren(_: number, node: AssetState) {
    return 'children' in node;
  }
}
