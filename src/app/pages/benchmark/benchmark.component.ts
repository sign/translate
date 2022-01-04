import {Component, OnInit} from '@angular/core';
import {GoogleAnalyticsTimingService} from '../../core/modules/google-analytics/google-analytics.service';
import {Pix2PixService} from '../../modules/pix2pix/pix2pix.service';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss']
})
export class BenchmarkComponent {

  benchmarks = {
    'pix2pix': this.pix2pixBench.bind(this)
  };

  stats = {};

  constructor(private gaTiming: GoogleAnalyticsTimingService, private pix2pix: Pix2PixService) {
  }

  async bench() {
    for(const bench of Object.values(this.benchmarks)) {
      await bench();
    }
  }

  buildStats() {
    for (const category of Object.keys(this.benchmarks)) {
      const events = this.gaTiming.events(category);
      const stats = {};
      for (const [_, name, args] of events) {
        const eVar = name.slice(category.length + 1);
        if (!(eVar in stats)) {
          stats[eVar] = [];
        }
        stats[eVar].push(args.value);
      }
      this.stats[category] = stats;
    }
  }

  async pix2pixBench() {
    // Set up an empty, white canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d');
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 256, 256);

    // Load pix2pix
    await this.pix2pix.loadModel();
    this.buildStats();

    // Evaluate 30 frames
    for (let i = 0; i < 30; i++) {
      await this.pix2pix.translate(canvas);
      this.buildStats();
    }
  }

}
