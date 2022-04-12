import {ComponentFixture, TestBed} from '@angular/core/testing';

import {AboutHeroComponent} from './about-hero.component';
import {AppTranslocoModule} from '../../../../core/modules/transloco/transloco.module';

describe('AboutHeroComponent', () => {
  let component: AboutHeroComponent;
  let fixture: ComponentFixture<AboutHeroComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [AboutHeroComponent],
      imports: [AppTranslocoModule]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AboutHeroComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
