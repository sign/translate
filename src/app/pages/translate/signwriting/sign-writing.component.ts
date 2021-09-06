import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {font} from '@sutton-signwriting/font-ttf/index.js';
import {BaseComponent} from '../../../components/base/base.component';
import {fromEvent} from 'rxjs';
import {takeUntil, tap} from 'rxjs/operators';

// Set local font directory, copied from @sutton-signwriting/font-ttf
font.cssAppend('assets/fonts/signwriting/');

@Component({
  selector: 'app-sign-writing',
  templateUrl: './sign-writing.component.html',
  styleUrls: ['./sign-writing.component.scss']
})
export class SignWritingComponent extends BaseComponent implements OnInit, OnDestroy {
  @Input() signs: string[];

  // Rerender when scheme changes
  colorSchemeMedia = window.matchMedia('(prefers-color-scheme: dark)');

  ngOnInit(): void {
    fromEvent(this.colorSchemeMedia, 'change').pipe(
      tap(() => {
        // Update signs to force re-rendering
        const signs = this.signs;
        this.signs = [];
        requestAnimationFrame(() => this.signs = signs);
      }),
      takeUntil(this.ngUnsubscribe)
    ).subscribe();
  }
}
