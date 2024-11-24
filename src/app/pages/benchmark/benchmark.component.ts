import {Component} from '@angular/core';
import {GoogleAnalyticsService} from '../../core/modules/google-analytics/google-analytics.service';
import {Pix2PixService} from '../../modules/pix2pix/pix2pix.service';
import {PoseService} from '../../modules/pose/pose.service';
import {transferableImage} from '../../core/helpers/image/transferable';
import {LanguageDetectionService} from '../../modules/translate/language-detection/language-detection.service';

@Component({
  selector: 'app-benchmark',
  templateUrl: './benchmark.component.html',
  styleUrls: ['./benchmark.component.scss'],
})
export class BenchmarkComponent {
  benchmarks = {
    cld: this.cldBench.bind(this),
    pix2pix: this.pix2pixBench.bind(this),
    pose: this.poseBench.bind(this),
  };

  stats: {[key: string]: {[key: string]: number[]}} = {};

  constructor(
    private ga: GoogleAnalyticsService,
    private pix2pix: Pix2PixService,
    private languageDetection: LanguageDetectionService,
    private pose: PoseService
  ) {}

  async bench() {
    for (const bench of Object.values(this.benchmarks)) {
      try {
        await bench();
      } catch (e) {
        alert(e.message);
      }
    }
  }

  buildStats() {
    for (const category of Object.keys(this.benchmarks)) {
      const traces = this.ga.traces.filter(({name}) => name.startsWith(category));
      if (traces.length === 0) {
        continue;
      }

      const stats = {};
      for (const {name, time} of traces) {
        const eVar = name.slice(category.length + 1);
        if (!(eVar in stats)) {
          stats[eVar] = [];
        }
        stats[eVar].push(time);
      }
      this.stats[category] = stats;
    }
  }

  async poseBench() {
    await this.pose.load();
    this.buildStats();

    // Set up an image of a person
    const image = new Image();
    await new Promise(resolve => {
      image.addEventListener('load', resolve);
      image.src = 'assets/tmp/example-image.png';
    });

    // Evaluate 30 frames
    for (let i = 0; i < 30; i++) {
      await this.pose.predict(image);
      this.buildStats();
    }
  }

  async cldBench() {
    await this.languageDetection.init();
    this.buildStats();

    // Evaluate 30 texts
    for (let i = 0; i < 30; i++) {
      await this.languageDetection.detectSpokenLanguage('Lorem ipsum dolor sit amet');
      this.buildStats();
    }
  }

  async pix2pixBench() {
    // Set up an empty, white canvas
    const canvas = document.createElement('canvas');
    canvas.width = canvas.height = 256;
    const ctx = canvas.getContext('2d', {willReadFrequently: true});
    ctx.fillStyle = 'white';
    ctx.fillRect(0, 0, 256, 256);

    // Load pix2pix
    await this.pix2pix.loadModel();
    this.buildStats();

    // Evaluate 30 frames
    for (let i = 0; i < 30; i++) {
      const image = await transferableImage(canvas, ctx);
      await this.pix2pix.translate(image);
      this.buildStats();
    }
  }
}
