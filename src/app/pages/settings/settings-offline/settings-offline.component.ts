import {Component, OnInit} from '@angular/core';
import {isIOS} from '../../../core/constants';
import {AssetsService, AssetState} from '../../../core/services/assets/assets.service';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';
import {TranslocoService} from '@ngneat/transloco';
import {takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../components/base/base.component';

const OFFLINE_PATHS = {
  avatarGlb: '3d/character.glb',
  avatarUsdz: '3d/character.usdz',
  pix2pixGenerator: 'models/generator/model.h5.layers16/',
  pix2pixUpscaler: 'models/upscaler/model.h5.layers/',
  translation: {
    spokenToSigned: {
      SpokenSigned: 'models/browsermt/spoken-to-signed/spoken-signed/',
      EnFr: 'models/browsermt/spoken-to-signed/en-fr/',
    },
  },
};

if (!isIOS) {
  delete OFFLINE_PATHS.avatarUsdz;
}

@Component({
  selector: 'app-settings-offline',
  templateUrl: './settings-offline.component.html',
  styleUrls: ['./settings-offline.component.scss'],
})
export class SettingsOfflineComponent extends BaseComponent implements OnInit {
  localFiles: {[key: string]: AssetState} = {};
  treeControl = new NestedTreeControl<AssetState>(node => node.children);
  filesTree = new MatTreeNestedDataSource<AssetState>();

  constructor(private assets: AssetsService, private transloco: TranslocoService) {
    super();
  }

  async ngOnInit() {
    this.localFiles = this.assetInfo('', OFFLINE_PATHS).children;
    this.updateTree();
    this.listenForLangChange();
  }

  listenForLangChange() {
    this.transloco.events$
      .pipe(
        tap(() => this.updateLabels()),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  assetInfo(name: string, obj: string | any) {
    if (typeof obj === 'string') {
      return {name, ...this.assets.stat(obj)};
    }
    const prefix = name ? name + '.' : '';
    const children = Object.entries(obj).map(([n, path]) => this.assetInfo(prefix + n, path));
    return {name, size: null, children: children};
  }

  updateTree() {
    this.filesTree.data = this.treeControl.dataNodes = Object.values(this.localFiles);
    this.updateLabels();
  }

  hasChildren(_: number, node: AssetState) {
    return 'children' in node;
  }

  async deleteCache(node: AssetState) {
    if (node.children) {
      this.treeControl.collapse(node);
      node.children = [];
      this.updateTree();
    }

    await this.assets.deleteCache(node.path);
    Object.assign(node, await this.assets.stat(node.path));

    this.updateTree();
  }

  async download(node: AssetState) {
    node.progress = 0.0001; // show progress bar, with non-falsey value
    await this.assets.download(node.path, (n, d) => (node.progress = n / d));

    // Update node after download
    Object.assign(node, await this.assets.stat(node.path));
    delete node.progress;
    this.updateTree();
  }

  async reDownload(node: AssetState) {
    await this.deleteCache(node);
    await this.download(node);
  }

  nodeLabel(node: AssetState) {
    if (node.name?.includes('.spokenToSigned.')) {
      const lastPart = node.name.split('.').pop();
      const lang = lastPart.substring(0, lastPart.length / 2).toLowerCase();
      const country = lastPart.substring(lastPart.length / 2).toLowerCase();

      return this.transloco.translate(`to`, {
        a: this.transloco.translate(`languages.${lang}`),
        b: this.transloco.translate(`countries.${country}`),
      });
    }
    return this.transloco.translate('settings.other.offline.files.' + node.name);
  }

  updateLabels(nodes?: AssetState[]) {
    for (const node of nodes ?? this.treeControl.dataNodes) {
      if (node.name) {
        node.label = this.nodeLabel(node);
        if (node.children) {
          this.updateLabels(node.children);
        }
      }
    }
  }
}
