import {Component, Input} from '@angular/core';

@Component({
  selector: 'app-benchmark-item',
  templateUrl: './benchmark-item.component.html',
  styleUrls: ['./benchmark-item.component.scss'],
})
export class BenchmarkItemComponent {
  @Input() title: string;
  @Input() timings: number[] = [];

  fps(): string {
    const sum = this.timings.reduce((a, b) => a + b, 0);
    const mean = sum / this.timings.length;
    return (1000 / mean).toFixed(1);
  }
}
