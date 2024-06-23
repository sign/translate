import {Injectable} from '@angular/core';
import {BehaviorSubject} from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class TranslateService {
  private spokenLanguageTextSubject = new BehaviorSubject<string>('');
  spokenLanguageText$ = this.spokenLanguageTextSubject.asObservable();

  setSpokenLanguageText(text: string): void {
    this.spokenLanguageTextSubject.next(text);
  }
}
