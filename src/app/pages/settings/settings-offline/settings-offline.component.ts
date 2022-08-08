import {Component, OnInit} from '@angular/core';
import {isIOS} from '../../../core/constants';
import {AssetsService, AssetState} from '../../../core/services/assets/assets.service';
import {MatTreeNestedDataSource} from '@angular/material/tree';
import {NestedTreeControl} from '@angular/cdk/tree';

const OFFLINE_PATHS = {
  pix2pixGenerator: 'models/generator/model.h5.layers16/',
  pix2pixUpscaler: 'models/upscaler/model.h5.layers/',
  avatarGlb: '3d/character.glb',
  avatarUsdz: '3d/character.usdz',
};

if (!isIOS) {
  delete OFFLINE_PATHS.avatarUsdz;
}

@Component({
  selector: 'app-settings-offline',
  templateUrl: './settings-offline.component.html',
  styleUrls: ['./settings-offline.component.scss'],
})
export class SettingsOfflineComponent implements OnInit {
  localFiles: {[key: string]: AssetState} = {};
  treeControl = new NestedTreeControl<AssetState>(node => node.children);
  filesTree = new MatTreeNestedDataSource<AssetState>();

  constructor(private assets: AssetsService) {}

  async ngOnInit() {
    await Promise.all(
      Object.entries(OFFLINE_PATHS).map(
        async ([name, path]) => (this.localFiles[name] = {name, ...(await this.assets.stat(path))})
      )
    );

    this.updateTree();
  }

  updateTree() {
    this.filesTree.data = this.treeControl.dataNodes = Object.values(this.localFiles);
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
    node.progress = 0.01; // show progress bar, with non-falsey value
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
}
