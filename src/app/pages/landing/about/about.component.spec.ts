import {ComponentFixture, TestBed} from '@angular/core/testing';
import {axe, toHaveNoViolations} from 'jasmine-axe';

import {AboutComponent} from './about.component';
import {AboutHeroComponent} from './about-hero/about-hero.component';
import {AboutDirectionComponent} from './about-direction/about-direction.component';
import {AboutOfflineComponent} from './about-offline/about-offline.component';
import {AboutSharingComponent} from './about-sharing/about-sharing.component';
import {StoresComponent} from '../../../components/stores/stores.component';
import {AppTranslocoTestingModule} from '../../../core/modules/transloco/transloco-testing.module';
import {AppAngularMaterialModule} from '../../../core/modules/angular-material/angular-material.module';
import {AboutAppearanceComponent} from './about-appearance/about-appearance.component';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AboutComponent,
        AboutHeroComponent,
        AboutAppearanceComponent,
        AboutDirectionComponent,
        AboutOfflineComponent,
        AboutSharingComponent,
        StoresComponent,
      ],
      imports: [AppTranslocoTestingModule, AppAngularMaterialModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
