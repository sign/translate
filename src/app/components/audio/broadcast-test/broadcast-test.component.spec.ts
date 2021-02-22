import {ComponentFixture, TestBed, waitForAsync} from '@angular/core/testing';

import {BroadcastTestComponent} from './broadcast-test.component';

describe('BroadcastTestComponent', () => {
  let component: BroadcastTestComponent;
  let fixture: ComponentFixture<BroadcastTestComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [BroadcastTestComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BroadcastTestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
