import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'app-benchmark-item',
  templateUrl: './benchmark-item.component.html',
  styleUrls: ['./benchmark-item.component.scss']
})
export class BenchmarkItemComponent {

  @Input() title: string;
  @Input() timings: number[];

  fps(): string {
    return (1000 / (this.timings.reduce((a, b) => a + b, 0) / this.timings.length)).toFixed(1);
  }
}
