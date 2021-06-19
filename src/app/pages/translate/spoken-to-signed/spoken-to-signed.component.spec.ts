import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SpokenToSignedComponent } from './spoken-to-signed.component';

describe('SpokenToSignedComponent', () => {
  let component: SpokenToSignedComponent;
  let fixture: ComponentFixture<SpokenToSignedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SpokenToSignedComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SpokenToSignedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
