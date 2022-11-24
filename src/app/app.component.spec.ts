import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';
import {AppComponent} from './app.component';
import {AppModule} from './app.module';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {Store} from '@ngxs/store';
import {SetSpokenLanguageText} from './modules/translate/translate.actions';
import {TranslocoService} from '@ngneat/transloco';

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

  it('should add embed class on body if embed url param is included', async () => {
    expect(document.body.className.includes('embed')).toEqual(false);
    component.urlParams.set('embed', '');
    component.checkURLEmbedding();
    expect(document.body.className.includes('embed')).toEqual(true);
  });

  it('should set spoken language text url param is included', async () => {
    component.urlParams.set('text', '123');
    const dispatchSpy = spyOn(store, 'dispatch');
    component.checkURLText();
    expect(dispatchSpy).toHaveBeenCalledWith(new SetSpokenLanguageText('123'));
  });

  it('language change to german should set direction ltr', async () => {
    const transloco = TestBed.inject(TranslocoService);
    transloco.setActiveLang('de');
    expect(document.dir).toEqual('ltr');
  });

  it('language change to hebrew should set direction rtl', async () => {
    const transloco = TestBed.inject(TranslocoService);
    transloco.setActiveLang('he');
    expect(document.dir).toEqual('rtl');
    document.dir = 'ltr'; // Restore state if succeeded
  });

  // it('should render app', () => {
  //   const fixture = TestBed.createComponent(AppComponent);
  //   fixture.detectChanges();
  //   const compiled = fixture.nativeElement;
  //   expect(compiled.querySelector('.content span').textContent).toContain('sign-translate app is running!');
  // });
});
