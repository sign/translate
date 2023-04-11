import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {Store} from '@ngxs/store';
import {SetSpokenLanguageText} from './modules/translate/translate.actions';
import {TranslocoService} from '@ngneat/transloco';
import {Router} from '@angular/router';

describe('AppComponent', () => {
  let store: Store;
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [AppModule],
    }).compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

    store = TestBed.inject(Store);
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });

  it('should add embed class on body if embed url param is included', () => {
    expect(document.body.className.includes('embed')).toEqual(false);
    component.urlParams.set('embed', '');
    component.checkURLEmbedding();
    expect(document.body.className.includes('embed')).toEqual(true);
  });

  it('should set spoken language text url param is included', () => {
    component.urlParams.set('text', '123');
    const dispatchSpy = spyOn(store, 'dispatch');
    component.checkURLText();
    expect(dispatchSpy).toHaveBeenCalledWith(new SetSpokenLanguageText('123'));
  });

  it('language change to german should set direction ltr', () => {
    const transloco = TestBed.inject(TranslocoService);
    transloco.setActiveLang('de');
    expect(document.dir).toEqual('ltr');
  });

  it('language change to hebrew should set direction rtl', () => {
    const transloco = TestBed.inject(TranslocoService);
    transloco.setActiveLang('he');
    expect(document.dir).toEqual('rtl');
    document.dir = 'ltr'; // Restore state if succeeded
  });

  xit('should navigate to home page and not show app-not-found element when button is clicked', async () => {
    const router = TestBed.inject(Router);
    router.initialNavigation();
    await router.navigate(['/not-found-path-does-not-exist']);

    // Wait for the router to navigate
    fixture.detectChanges();
    await fixture.whenStable();

    const getElement = () => fixture.nativeElement.querySelector('app-not-found');

    // Check if the app navigated to the not found page
    expect(getElement()).not.toBeNull();

    // Simulate button click
    const button = fixture.nativeElement.querySelector('ion-button');
    button.click();

    // Wait for the router to navigate
    fixture.detectChanges();
    await fixture.whenStable();

    // Check if the app-not-found element is not in the DOM
    expect(getElement()).toBeNull();
  });
});
