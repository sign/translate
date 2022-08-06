import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsOfflineComponent} from './offline.component';

describe('SettingsOfflineComponent', () => {
  let component: SettingsOfflineComponent;
  let fixture: ComponentFixture<SettingsOfflineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsOfflineComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsOfflineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
