import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {BreakpointObserver} from '@angular/cdk/layout';
import {map} from 'rxjs/operators';
import {MatDialogRef} from '@angular/material/dialog';

interface Page {
  path: string;
  icon: string;
}

interface PagesGroup {
  name: string;
  pages: Page[];
}

@Component({
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss'],
})
export class SettingsPageComponent implements OnInit {
  isLargePage$ = this.observer.observe(['(min-width: 600px)']).pipe(map(res => res.matches));

  groups: PagesGroup[] = [
    {
      name: 'support',
      pages: [
        {path: 'feedback', icon: 'rate_review'},
        {path: 'about', icon: 'info'},
      ],
    },
    {
      name: 'voice',
      pages: [
        {path: 'input', icon: 'mic'},
        {path: 'output', icon: 'volume_up'},
      ],
    },
    {
      name: 'other',
      pages: [
        {path: 'offline', icon: 'airplanemode_active'},
        {path: 'appearance', icon: 'account_box'},
      ],
    },
  ];

  contentPage: string = null;

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private observer: BreakpointObserver,
    private dialogRef: MatDialogRef<SettingsPageComponent>
  ) {}

  ngOnInit(): void {
    this.updateContentPage();
  }

  updateContentPage() {
    const settingsRoute = this.route.children.find(c => c.outlet === 'settings');
    if (!settingsRoute || settingsRoute.children.length === 0) {
      this.contentPage = null;
      return;
    }
    const childRoutePath = settingsRoute.children[0].snapshot.url[0].path;
    const group = this.groups.find(g => g.pages.find(p => p.path === childRoutePath));
    this.contentPage = `${group.name}.${childRoutePath}`;
  }

  closeContentPage() {
    this.contentPage = null;
    return this.router.navigate([{outlets: {settings: ['s']}}]);
  }

  open(group: PagesGroup, page: Page) {
    this.contentPage = `${group.name}.${page.path}`;
    return this.router.navigate([{outlets: {settings: ['s', page.path]}}]);
  }

  dismiss() {
    return this.dialogRef.close();
  }
}
