import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutAppearanceComponent} from './about-appearance.component';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';

describe('AboutAppearanceComponent', () => {
  let component: AboutAppearanceComponent;
  let fixture: ComponentFixture<AboutAppearanceComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutAppearanceComponent],
      imports: [AppTranslocoModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutAppearanceComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
