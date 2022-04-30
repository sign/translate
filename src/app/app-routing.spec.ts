import {TestBed} from '@angular/core/testing';
import {AppRoutingModule} from './app-routing.module';
import {Router} from '@angular/router';

describe('AppRoutingModule', () => {
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppRoutingModule],
      teardown: {destroyAfterEach: false}
    });
  });

  it('should load about page lazy module ', () => {
    router = TestBed.inject(Router);
    router.initialNavigation();

    router.navigate(['/about']);
    const route = router.getCurrentNavigation();
    expect(String(route.extractedUrl)).toEqual('/about');
  });
});

