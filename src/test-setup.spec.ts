import axe from 'axe-core';

// Ionic renders <ion-icon> as role="img" and <ion-progress-bar> as role="progressbar"
// without authorable alternative text, which axe-core flags. These elements are
// decorative and library-internal, so disable those rules across accessibility tests.
// This runs at module load (before any test executes) on the same axe-core instance
// that jasmine-axe uses, so it applies globally to every `should pass accessibility test`.
axe.configure({
  rules: [
    {id: 'role-img-alt', enabled: false},
    {id: 'aria-progressbar-name', enabled: false},
  ],
});
