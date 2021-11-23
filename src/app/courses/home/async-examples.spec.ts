import { fakeAsync, flush, tick, flushMicrotasks } from '@angular/core/testing';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';


describe('Asynchronous Testing Examples', () => {

  it('Asynchronous test example with Jasmine done()', (done: DoneFn) => {
    let test = false;

    setTimeout(() => {
      console.log('running assertions');
      test = true;
      expect(test).toBeTruthy();

      done(); // wait that assign variable and expect() was evaluated before finish it()
    }, 1000);
  });

  it('Asynchronous test example with - setTimeout()', fakeAsync(() => {
    let test = false;

    setTimeout(() => { });

    setTimeout(() => {
      console.log('running assertions setTimeout()');
      test = true;
    }, 1000);

    // tick(500); // Placed tick in fakeAsync zone in order to simulate passage of time
    // tick(499);
    // tick(1);


    flush(); // in order to be sure that all setTimeout() was completed

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example with - plain Promise', fakeAsync(() => {
    let test = false;

    console.log('creating Promise');

    Promise.resolve().then(() => {
      console.log('Promise evaluated sucessfully');
      return Promise.resolve();
    }).then(() => {
      console.log('Promise  second then() evaluated sucessfully');
      test = true;
    });

    flushMicrotasks(); // launch all microtasks (then() blocks) before to pass to the next step
    console.log('running test assertions');

    expect(test).toBeTruthy();
  }));

  it('Asynchronous test example - Promises + setTimeout()', fakeAsync(() => {
    let counter = 0;

    Promise.resolve()
      .then(() => {
        counter += 10;

        setTimeout(() => {
          counter += 1;
        }, 1000);
      });

    expect(counter).toBe(0);

    flushMicrotasks();

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(10);

    tick(500);

    expect(counter).toBe(11);
  }));


  it('Asynchronous test example - Observables', fakeAsync(() => {
    let test = false;

    console.log('creating Observable');

    const test$ = of(test).pipe(delay(1000));

    test$.subscribe(() => {
      test = true;
    });

    tick(1000);

    console.log('running test assertions');

    expect(test).toBeTruthy();
  }));
});
