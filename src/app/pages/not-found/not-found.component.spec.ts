import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotFoundComponent} from './not-found.component';
import {provideTranslocoTesting} from '../../core/modules/transloco/transloco-testing.module';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotFoundComponent],
      providers: [provideTranslocoTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(NotFoundComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
