// Karma configuration file, see link for more information
// https://karma-runner.github.io/1.0/config/configuration-file.html

const coverageDir = require('path').join(__dirname, './coverage/');
console.log('coverageDir', coverageDir);

module.exports = function (config) {
  config.set({
    basePath: '',
    browserDisconnectTimeout: 10000, // 10 seconds
    browserDisconnectTolerance: 2, // allow up to 2 disconnects
    retryLimit: 2,
    frameworks: ['jasmine', '@angular-devkit/build-angular'],
    plugins: [
      require('karma-jasmine'),
      require('karma-chrome-launcher'),
      require('karma-firefox-launcher'),
      require('karma-safari-launcher'),
      require('karma-jasmine-html-reporter'),
      require('karma-coverage'),
      require('karma-spec-reporter'),
      require('@angular-devkit/build-angular/plugins/karma'),
    ],
    client: {
      jasmine: {
        // you can add configuration options for Jasmine here
        // the possible options are listed at https://jasmine.github.io/api/edge/Configuration.html
        // for example, you can disable the random execution with `random: false`
        // or set a specific seed with `seed: 4321`
        timeoutInterval: 20000,
      },
      clearContext: false, // leave Jasmine Spec Runner output visible in browser
      captureConsole: true, // Capture errors in the console
    },
    jasmineHtmlReporter: {
      suppressAll: true, // removes the duplicated traces
    },
    coverageReporter: {
      dir: coverageDir,
      subdir: '.',
      reporters: [{type: 'html'}, {type: 'text-summary'}, {type: 'lcovonly'}],
    },
    reporters: ['spec', 'progress', 'kjhtml'],
    specReporter: {
      maxLogLines: 10, // limit number of lines logged per test
      suppressErrorSummary: true, // do not print error summary
      suppressFailed: false, // do not print information about failed tests
      suppressPassed: false, // do not print information about passed tests
      suppressSkipped: true, // do not print information about skipped tests
      showSpecTiming: true, // print the time elapsed for each spec
    },
    port: 9876,
    colors: true,
    logLevel: config.LOG_INFO,
    autoWatch: true,
    browsers: ['Chrome', 'Firefox', 'Safari'],
    singleRun: false,
    restartOnFileChange: true,
    files: [{pattern: './src/manifest.webmanifest', included: false, watched: true, served: true}],
  });
};
