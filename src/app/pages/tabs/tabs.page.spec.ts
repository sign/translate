import {CUSTOM_ELEMENTS_SCHEMA} from '@angular/core';
import {ComponentFixture, TestBed} from '@angular/core/testing';

import {TabsPageComponent} from './tabs.page';

describe('TabsPageComponent', () => {
  let component: TabsPageComponent;
  let fixture: ComponentFixture<TabsPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TabsPageComponent],
      schemas: [CUSTOM_ELEMENTS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TabsPageComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
