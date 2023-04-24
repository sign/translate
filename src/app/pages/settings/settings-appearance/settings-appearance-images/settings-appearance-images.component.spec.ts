import {ComponentFixture, TestBed} from '@angular/core/testing';

import {SettingsAppearanceImagesComponent} from './settings-appearance-images.component';

describe('SettingsAppearanceImagesComponent', () => {
  let component: SettingsAppearanceImagesComponent;
  let fixture: ComponentFixture<SettingsAppearanceImagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [SettingsAppearanceImagesComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(SettingsAppearanceImagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
