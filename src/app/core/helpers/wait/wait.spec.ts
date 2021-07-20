import {fakeAsync, flush, tick} from '@angular/core/testing';
import {wait} from './wait';
import createSpy = jasmine.createSpy;

describe('wait', () => {
  it('should resolve after specified time', fakeAsync(() => {
    const spy = createSpy('resolve');
    wait(20).then(spy);
    tick(25);
    expect(spy).toHaveBeenCalled();
  }));

  it('should not resolve before specified time', fakeAsync(() => {
    const spy = createSpy('resolve');
    wait(20).then(spy);
    tick(15);
    expect(spy).not.toHaveBeenCalled();
    flush();
  }));
});
