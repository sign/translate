import {Component, inject, OnInit} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {NestedTreeControl} from '@angular/cdk/tree';
import {AssetState} from '../../../core/services/assets/assets.service';
import {MatTreeModule, MatTreeNestedDataSource} from '@angular/material/tree';
import {MatIconButton} from '@angular/material/button';
import {IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {chevronDownOutline, chevronForwardOutline} from 'ionicons/icons';
import {NgTemplateOutlet} from '@angular/common';
import {TranslocoPipe} from '@jsverse/transloco';

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
  imports: [MatTreeModule, MatIconButton, IonIcon, TranslocoPipe, NgTemplateOutlet],
})
export class LicensesComponent implements OnInit {
  private httpClient = inject(HttpClient);

  treeControl = new NestedTreeControl<Node>((node: any) => node.children);
  filesTree = new MatTreeNestedDataSource<Node>();

  constructor() {
    addIcons({chevronDownOutline, chevronForwardOutline});
  }

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
