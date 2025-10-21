import {Component, inject, NgModule, OnInit} from '@angular/core';
import {geoJSON, latLng, Map} from 'leaflet';
import {HttpClient, provideHttpClient, withFetch} from '@angular/common/http';
import {firstValueFrom} from 'rxjs';
import {LeafletModule} from '@bluehalo/ngx-leaflet';
import {BaseComponent} from '../base/base.component';

function logMax(arr: number[]) {
  return Math.max(...arr); // Possible to wrap with Math.log()
}

@Component({
  selector: 'app-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss'],
  imports: [LeafletModule],
})
export class MapComponent extends BaseComponent implements OnInit {
  private http = inject(HttpClient);

  static mapGeoJson = null;

  options = {
    layers: [],
    zoom: 1.3,
    center: latLng(40.5285, 8.2318),

    scrollWheelZoom: false,
    zoomControl: false,
    zoomDelta: 0.1,
    zoomSnap: 0.1,
  };

  ngOnInit() {
    if (!('document' in globalThis)) {
      return;
    }

    const head = document.getElementsByTagName('head')[0];

    const style = document.createElement('link');
    style.rel = 'stylesheet';
    style.href = `map.css`;
    head.appendChild(style);
  }

  async onMapReady(map: Map) {
    map.dragging.disable();
    map.doubleClickZoom.disable();

    const statistics = await firstValueFrom(
      this.http.get<{[key: string]: {[key: string]: number}}>('assets/promotional/geography/world-stats.json')
    );
    const maxOpacity = logMax(
      Object.values(statistics)
        .map(Object.values)
        .reduce((a, b) => a.concat(b), [])
    );

    const modifyStyle = (feature, style) => {
      return style;
    };

    const style = feature => {
      const countryCode = feature.properties.iso_a2.toLowerCase();
      const opacity = countryCode in statistics ? logMax(Object.values(statistics[countryCode])) / maxOpacity : 0;

      if (opacity === 0) {
        return modifyStyle(feature, {
          fillColor: '#f3f3f3',
          weight: 1,
          opacity: 1,
          color: '#d1d1db',
          fillOpacity: 1,
        });
      } else {
        return modifyStyle(feature, {
          fillColor: '#E31A1C',
          weight: 1,
          opacity: 1,
          color: '#d1d1db',
          fillOpacity: opacity,
        });
      }
    };

    if (!MapComponent.mapGeoJson) {
      MapComponent.mapGeoJson = await firstValueFrom(this.http.get('assets/promotional/geography/world.geojson'));
    }

    geoJSON(MapComponent.mapGeoJson, {
      style,
      onEachFeature: function (feature, layer) {
        layer.on('mouseover', function () {
          this.setStyle({fillOpacity: 1});
        });
        layer.on('mouseout', function () {
          this.setStyle(style(feature));
        });
      },
    }).addTo(map);
  }
}

@NgModule({
  imports: [LeafletModule, MapComponent],
  providers: [provideHttpClient(withFetch())],
})
export class MapModule {}
