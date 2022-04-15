import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutComponent} from './about.component';
import {AboutHeroComponent} from './about-hero/about-hero.component';
import {AboutDirectionComponent} from './about-direction/about-direction.component';
import {AboutOfflineComponent} from './about-offline/about-offline.component';
import {AboutSharingComponent} from './about-sharing/about-sharing.component';
import {StoresComponent} from '../../../components/stores/stores.component';
import {AppTranslocoModule} from '../../../core/modules/transloco/transloco.module';

describe('AboutComponent', () => {
  let component: AboutComponent;
  let fixture: ComponentFixture<AboutComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [
        AboutComponent,
        AboutHeroComponent,
        AboutDirectionComponent,
        AboutOfflineComponent,
        AboutSharingComponent,
        StoresComponent,
      ],
      imports: [AppTranslocoModule],
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
});
