import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, NavigationStart, Router} from '@angular/router';
import {MatDialog} from '@angular/material/dialog';
import {ComponentType} from '@angular/cdk/overlay';

@Component({
  template: '',
})
export class LazyDialogEntryComponent implements OnInit {
  static component: ComponentType<unknown> = null;

  constructor(public dialog: MatDialog, private route: ActivatedRoute, private router: Router) {}

  async ngOnInit() {
    // Load component dynamically
    if (!LazyDialogEntryComponent.component) {
      const chunk = await import('../settings/settings.module');
      LazyDialogEntryComponent.component = Object.values(chunk)[0] as ComponentType<unknown>;
    }

    const dialogRef = this.dialog.open(LazyDialogEntryComponent.component, {
      width: '960px',
    });

    dialogRef.afterClosed().subscribe(() => {
      this.router.navigate([{outlets: {dialog: [], settings: []}}], {queryParamsHandling: 'preserve'});
    });

    this.router.events.subscribe(event => {
      if (event instanceof NavigationStart) {
        if (!event.url.includes('dialog')) {
          dialogRef.close();
        }
      }
    });
  }
}
