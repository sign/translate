import {ComponentFixture, TestBed} from '@angular/core/testing';

import {LazyMapComponent} from './lazy-map.component';

describe('LazyMapComponent', () => {
  let component: LazyMapComponent;
  let fixture: ComponentFixture<LazyMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [LazyMapComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(LazyMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
