import {AfterViewInit, Component, viewChild, ViewContainerRef} from '@angular/core';
import {ComponentType} from '@angular/cdk/overlay';

@Component({
  selector: 'app-lazy-map',
  templateUrl: './lazy-map.component.html',
  styleUrls: ['./lazy-map.component.scss'],
})
export class LazyMapComponent implements AfterViewInit {
  readonly mapHost = viewChild('mapHost', {read: ViewContainerRef});

  constructor() {}

  async ngAfterViewInit() {
    if (!('window' in globalThis)) {
      // Leaflet calls "window" directly, so we can only load it in the browser
      return;
    }
    const chunk = await import('../../../../components/map/map.component');
    const component = Object.values(chunk)[0] as ComponentType<unknown>;

    this.mapHost().createComponent(component);
  }
}
