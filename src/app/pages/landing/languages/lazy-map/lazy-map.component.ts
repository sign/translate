import {AfterViewInit, Component, OnInit, ViewChild, ViewContainerRef} from '@angular/core';
import {ComponentType} from '@angular/cdk/overlay';

@Component({
  selector: 'app-lazy-map',
  templateUrl: './lazy-map.component.html',
  styleUrls: ['./lazy-map.component.scss'],
})
export class LazyMapComponent implements AfterViewInit {
  @ViewChild('mapHost', {read: ViewContainerRef}) mapHost: ViewContainerRef;

  constructor() {}

  async ngAfterViewInit() {
    const chunk = await import('../../../../components/map/map.component');
    const component = Object.values(chunk)[0] as ComponentType<unknown>;

    this.mapHost.createComponent(component);
  }
}
