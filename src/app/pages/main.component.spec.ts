import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MainComponent} from './main.component';
import {axe, toHaveNoViolations} from 'jasmine-axe';
import {RouterTestingModule} from '@angular/router/testing';
import {IonIcon, IonLabel, IonTabBar, IonTabButton, IonTabs} from '@ionic/angular/standalone';

describe('MainComponent', () => {
  let component: MainComponent;
  let fixture: ComponentFixture<MainComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IonLabel, IonIcon, IonTabButton, IonTabBar, IonTabs, RouterTestingModule, MainComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MainComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should pass accessibility test', async () => {
    jasmine.addMatchers(toHaveNoViolations);
    const a11y = await axe(fixture.nativeElement);
    expect(a11y).toHaveNoViolations();
  });
});
