import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutSharingComponent} from './about-sharing.component';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';

describe('AboutSharingComponent', () => {
  let component: AboutSharingComponent;
  let fixture: ComponentFixture<AboutSharingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutSharingComponent],
      imports: [AppTranslocoModule],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutSharingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
