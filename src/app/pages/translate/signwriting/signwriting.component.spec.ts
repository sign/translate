import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SignwritingComponent} from './signwriting.component';

describe('SignwritingComponent', () => {
  let component: SignwritingComponent;
  let fixture: ComponentFixture<SignwritingComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SignwritingComponent]
    })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SignwritingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
