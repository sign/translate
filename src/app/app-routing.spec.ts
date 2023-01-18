import {TestBed} from '@angular/core/testing';
import {AppRoutingModule} from './app-routing.module';
import {Router} from '@angular/router';

describe('AppRoutingModule', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      teardown: {destroyAfterEach: false},
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
