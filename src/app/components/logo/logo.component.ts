import {Component} from '@angular/core';
import {RouterLink} from '@angular/router';
import {MatTooltipModule} from '@angular/material/tooltip';

@Component({
  selector: 'app-logo',
  templateUrl: './logo.component.html',
  styleUrl: './logo.component.scss',
  imports: [RouterLink, MatTooltipModule],
})
export class LogoComponent {}
