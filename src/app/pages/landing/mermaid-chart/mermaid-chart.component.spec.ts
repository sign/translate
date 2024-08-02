import {ComponentFixture, TestBed} from '@angular/core/testing';

import {MermaidChartComponent} from './mermaid-chart.component';

describe('MermaidChartComponent', () => {
  let component: MermaidChartComponent;
  let fixture: ComponentFixture<MermaidChartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MermaidChartComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(MermaidChartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
