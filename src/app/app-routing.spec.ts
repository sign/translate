// import {TestBed} from '@angular/core/testing';
// import {AppRoutingModule} from './app-routing.module';
// import {Router} from '@angular/router';
// import {provideStore([SettingsState], ngxsConfig)} from './core/modules/ngxs/ngxs.module';
// import {provideHttpClient} from '@angular/common/http';
// import {ngxsConfig} from './app.config';
// import {SettingsState} from './modules/settings/settings.state';
//
// describe('AppRoutingModule', () => {
//   let router: Router;
//
//   beforeEach(async () => {
//     await TestBed.configureTestingModule({
//       teardown: {destroyAfterEach: false},
//       imports: [AppRoutingModule, provideStore([SettingsState], ngxsConfig)],
//       providers: [provideHttpClient()],
//     });
//   });
//
//   const pages = {
//     '/': 'translate',
//     '/playground': 'playground',
//     '/about': 'about',
//     '/benchmark': 'benchmark',
//     '/legal': 'legal',
//   };
//
//   for (const [path, page] of Object.entries(pages)) {
//     it(`should load ${page} page`, () => {
//       router = TestBed.inject(Router);
//       router.initialNavigation();
//
//       router.navigate([path]);
//       const route = router.getCurrentNavigation();
//       expect(String(route.extractedUrl)).toEqual(path);
//     });
//   }
// });
