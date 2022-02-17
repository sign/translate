import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BenchmarkComponent} from './benchmark.component';
import {AppAngularMaterialModule} from '../../core/modules/angular-material/angular-material.module';
import {HttpClientModule} from '@angular/common/http';

describe('BenchmarkComponent', () => {
  let component: BenchmarkComponent;
  let fixture: ComponentFixture<BenchmarkComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BenchmarkComponent],
      imports: [
        AppAngularMaterialModule,
        HttpClientModule
      ]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
