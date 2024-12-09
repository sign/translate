import {Component} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule} from '@angular/forms';
import {tap} from 'rxjs/operators';
import {takeUntilDestroyed} from '@angular/core/rxjs-interop';
import {IonButton, IonCard, IonCardContent, IonCardHeader, IonCardTitle, IonIcon} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {arrowForward} from 'ionicons/icons';
import {DecimalPipe} from '@angular/common';

@Component({
  selector: 'app-about-pricing',
  templateUrl: './about-pricing.component.html',
  styleUrls: ['./about-pricing.component.scss'],
  imports: [IonCard, IonCardHeader, IonCardTitle, IonCardContent, IonButton, ReactiveFormsModule, IonIcon, DecimalPipe],
})
export class AboutPricingComponent {
  form = new FormGroup({
    inputTokens: new FormControl(0),
    outputFrames: new FormControl(0),
    inputFrames: new FormControl(0),
    outputTokens: new FormControl(0),
  });

  pricing: {[key: string]: number} = {
    inputTokens: 0.001,
    outputFrames: 0.0001,
    inputFrames: 0.0001,
    outputTokens: 0.001,
  };

  price: number = 0;

  presets = [
    {
      type: 'Movie',
      color: 'danger',
      inputTokens: 20_000,
      inputFrames: 0,
      outputFrames: 90 * 60 * 24,
      outputTokens: 0,
    },
    {
      type: 'Video Call',
      color: 'tertiary',
      inputTokens: 1500,
      outputTokens: 1500,
      inputFrames: 30 * 60 * 30,
      outputFrames: 30 * 60 * 30,
    },
    {
      type: 'Small Website',
      inputTokens: 5000,
      outputTokens: 0,
      inputFrames: 0,
      outputFrames: 2000 * 30,
    },
  ];

  constructor() {
    this.form.valueChanges
      .pipe(
        tap(() => (this.price = this.calcPrice())),
        takeUntilDestroyed()
      )
      .subscribe();

    addIcons({arrowForward});
  }

  applyPreset(preset: any) {
    this.form.patchValue(preset);
  }

  calcPrice() {
    let price = 0;
    for (const key of Object.keys(this.pricing)) {
      price += this.pricing[key] * this.form.get(key).value;
    }
    return price;
  }
}
