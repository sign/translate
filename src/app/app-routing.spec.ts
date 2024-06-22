import {TestBed} from '@angular/core/testing';
import {AppRoutingModule} from './app-routing.module';
import {Router} from '@angular/router';
import {AppNgxsModule} from './core/modules/ngxs/ngxs.module';
import {provideHttpClient} from '@angular/common/http';

describe('AppRoutingModule', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      teardown: {destroyAfterEach: false},
      imports: [AppRoutingModule, AppNgxsModule],
      providers: [provideHttpClient()],
    });
  });

  const pages = {
    '/': 'translate',
    '/playground': 'playground',
    '/about': 'about',
    '/benchmark': 'benchmark',
    '/legal': 'legal',
  };

  for (const [path, page] of Object.entries(pages)) {
    it(`should load ${page} page`, () => {
      router = TestBed.inject(Router);
      router.initialNavigation();

      router.navigate([path]);
      const route = router.getCurrentNavigation();
      expect(String(route.extractedUrl)).toEqual(path);
    });
  }
});
