import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {font} from '@sutton-signwriting/font-ttf/index.js';

// Set local font directory, copied from @sutton-signwriting/font-ttf
font.cssAppend('assets/fonts/signwriting/');

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss']
})
export class SignWritingComponent implements OnInit, OnDestroy {
  @Input() signs: string[];

  // Rerender when scheme changes
  colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');
  colorSchemeListener: EventListener;

  ngOnInit(): void {
    this.colorSchemeListener = () => {
      // Update signs to force re-rendering
      const signs = this.signs;
      this.signs = [];
      requestAnimationFrame(() => this.signs = signs);
    };
    this.colorSchemeMedia.addEventListener('change', this.colorSchemeListener);
  }

  ngOnDestroy(): void {
    this.colorSchemeMedia.removeEventListener('change', this.colorSchemeListener);
  }
}
