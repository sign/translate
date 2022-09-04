import {Component} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';

@Component({
  selector: 'app-settings-about',
  templateUrl: './settings-about.component.html',
  styleUrls: ['./settings-about.component.scss'],
})
export class SettingsAboutComponent {
  legalPages: string[] = ['terms', 'privacy', 'licenses'];

  constructor(public route: ActivatedRoute, private router: Router) {}

  async navigateToLegalPage(page: string) {
    await this.router.navigate([{outlets: {dialog: []}}]);
    await this.router.navigate(['legal', page], {
      relativeTo: this.route.root,
      queryParamsHandling: 'preserve',
    });
  }
}
