import {Component} from '@angular/core';
import {IonButton, IonButtons, IonFabButton, IonIcon, IonTitle, IonToolbar} from '@ionic/angular/standalone';
import {addIcons} from 'ionicons';
import {cameraReverseOutline, ellipseOutline} from 'ionicons/icons';
import {UploadComponent} from '../upload/upload.component';

@Component({
  selector: 'app-signed-language-input',
  templateUrl: './signed-language-input.component.html',
  styleUrl: './signed-language-input.component.scss',
  imports: [IonToolbar, IonButtons, IonButton, IonFabButton, IonTitle, IonIcon, UploadComponent],
})
export class SignedLanguageInputComponent {
  constructor() {
    addIcons({ellipseOutline, cameraReverseOutline});
  }
}
