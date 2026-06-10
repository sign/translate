import {TestBed} from '@angular/core/testing';
import {Capacitor} from '@capacitor/core';
import {RyloRedirectOverlayComponent} from './rylo-redirect-overlay.component';

describe('RyloRedirectOverlayComponent', () => {
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RyloRedirectOverlayComponent],
    }).compileComponents();
  });

  it('renders the redirect overlay with a CTA to Rylo on web', () => {
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(false);
    const fixture = TestBed.createComponent(RyloRedirectOverlayComponent);
    fixture.detectChanges();

    const cta = fixture.nativeElement.querySelector('.rylo-overlay__cta') as HTMLAnchorElement;
    expect(cta).toBeTruthy();
    expect(cta.getAttribute('href')).toBe('https://rylo.com/sign/translate');
  });

  it('renders nothing on native platforms', () => {
    spyOn(Capacitor, 'isNativePlatform').and.returnValue(true);
    const fixture = TestBed.createComponent(RyloRedirectOverlayComponent);
    fixture.detectChanges();

    expect(fixture.nativeElement.querySelector('.rylo-overlay')).toBeNull();
  });
});
