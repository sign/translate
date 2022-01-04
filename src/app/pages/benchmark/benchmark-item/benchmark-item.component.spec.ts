import {ComponentFixture, TestBed} from '@angular/core/testing';

import {BenchmarkItemComponent} from './benchmark-item.component';
import {AppAngularMaterialModule} from "../../../core/modules/angular-material/angular-material.module";

describe('BenchmarkItemComponent', () => {
  let component: BenchmarkItemComponent;
  let fixture: ComponentFixture<BenchmarkItemComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [BenchmarkItemComponent],
      imports: [AppAngularMaterialModule]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BenchmarkItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
