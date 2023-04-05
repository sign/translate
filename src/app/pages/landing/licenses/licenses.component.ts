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
    this.httpClient.get('/licenses.json').subscribe((licenses: any) => {
      this.updateTree(licenses);
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
