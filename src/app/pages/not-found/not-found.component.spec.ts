import {ComponentFixture, TestBed} from '@angular/core/testing';

import {NotFoundComponent} from './not-found.component';
import {
  AppTranslocoTestingModule,
  provideTranslocoTesting,
} from '../../core/modules/transloco/transloco-testing.module';
import {IonicModule} from '@ionic/angular';

describe('NotFoundComponent', () => {
  let component: NotFoundComponent;
  let fixture: ComponentFixture<NotFoundComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [NotFoundComponent],
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
