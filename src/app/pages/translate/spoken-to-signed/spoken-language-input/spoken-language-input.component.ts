import {Component, Input, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {Store} from '@ngxs/store';
import {from, interval, Observable} from 'rxjs';
import {concatMap, debounce, distinctUntilChanged, first, skipWhile, takeUntil, tap} from 'rxjs/operators';
import {BaseComponent} from '../../../../components/base/base.component';
import {
  SetSpokenLanguage,
  SetSpokenLanguageText,
  SuggestAlternativeText,
} from '../../../../modules/translate/translate.actions';
import {TranslateStateModel} from '../../../../modules/translate/translate.state';

@Component({
  selector: 'app-spoken-language-input',
  templateUrl: './spoken-language-input.component.html',
  styleUrls: ['./spoken-language-input.component.scss'],
})
export class SpokenLanguageInputComponent extends BaseComponent implements OnInit {
  translate$!: Observable<TranslateStateModel>;
  text$!: Observable<string>;
  normalizedText$!: Observable<string>;

  text = new FormControl();
  maxTextLength = 500;
  detectedLanguage: string;
  spokenLanguage: string;

  @Input() isMobile = false;

  selectedFile: File | null = null;

  uploadFile(): void {
    const fileInput = document.getElementById('fileUpload') as HTMLInputElement;
    fileInput?.click();
  }

  onFileSelected(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      this.selectedFile = input.files[0];
      console.log(`Selected file: ${this.selectedFile.name}`);

      // Handle the uploaded file here
      this.processUploadedFile(this.selectedFile);
    }
  }

  processUploadedFile(file: File): void {
    const reader = new FileReader();
    reader.onload = e => {
      const fileContent = e.target?.result;
      if (fileContent) {
        console.log('File content:', fileContent);

        // Split the file content into sentences using regex
        const sentences = (fileContent as string).match(/[^.!?]*[.!?]/g) || [];

        console.log('------', sentences);

        // Create an observable to emit each sentence sequentially
        from(sentences)
          .pipe(
            concatMap(sentence => {
              // Dispatch the sentence first
              const trimmedSentence = sentence.trim();
              this.text.setValue(trimmedSentence);
              this.store.dispatch(new SetSpokenLanguageText(trimmedSentence));

              // Then wait for the store to update
              return this.store
                .select(state => state.translate.signedLanguageVideo)
                .pipe(
                  first(videoURL => !!videoURL), // Wait for a valid videoURL to indicate processing is complete
                  tap(() => {
                    console.log('Store updated for sentence:', trimmedSentence);
                  })
                );
            })
          )
          .subscribe({
            error: err => console.error('Error processing sentences:', err),
            complete: () => console.log('All sentences processed'),
          });
      }
    };

    reader.readAsText(file); // For text files. Adjust for other file types.
  }

  constructor(private store: Store) {
    super();
    this.translate$ = this.store.select<TranslateStateModel>(state => state.translate);
    this.text$ = this.store.select<string>(state => state.translate.spokenLanguageText);
    this.normalizedText$ = this.store.select<string>(state => state.translate.normalizedSpokenLanguageText);
  }

  ngOnInit() {
    this.translate$
      .pipe(
        tap(({spokenLanguage, detectedLanguage}) => {
          this.detectedLanguage = detectedLanguage;
          this.spokenLanguage = spokenLanguage ?? detectedLanguage;
        }),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Local text changes
    this.text.valueChanges
      .pipe(
        debounce(() => interval(300)),
        skipWhile(text => !text), // Don't run on empty text, on app launch
        distinctUntilChanged((a, b) => a.trim() === b.trim()),
        tap(text => this.store.dispatch(new SetSpokenLanguageText(text))), // TODO: Find the store
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    this.text.valueChanges
      .pipe(
        debounce(() => interval(1000)),
        distinctUntilChanged((a, b) => a.trim() === b.trim()),
        tap(text => this.store.dispatch(new SuggestAlternativeText())),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();

    // Changes from the store
    this.text$
      .pipe(
        tap(text => this.text.setValue(text)),
        takeUntil(this.ngUnsubscribe)
      )
      .subscribe();
  }

  setText(text: string) {
    this.store.dispatch(new SetSpokenLanguageText(text));
  }

  setDetectedLanguage() {
    this.store.dispatch(new SetSpokenLanguage(this.detectedLanguage));
  }
}
