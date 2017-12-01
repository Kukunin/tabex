'use strict';

describe('Client destroy', function () {
  var wnd1, wnd2;

  function wait(condition, callback) {
    if (!condition()) {
      setTimeout(function() { wait(condition, callback); }, 10);
      return;
    }

    callback();
  }

  function initWindows(done) {
    wnd1 = window.open('fixtures/client_local_master.html', 'client_local_wnd1');
    wait(function() { return wnd1.live; }, function() {
      wnd2 = window.open('fixtures/client_local_master.html', 'client_local_wnd2');
      wait(function() { return wnd2.live; }, function() {
        wait(function() { return wnd1.masterEvent && wnd2.masterEvent; }, done);
      });
    });
  }

  beforeEach(initWindows);

  /* eslint-disable no-undef, block-scoped-var */
  afterEach(function () {
    wnd1.close();
    wnd2.close();
  });

  it('makes first window a master', function (done) {
    assert.strictEqual(true, wnd1.isMaster);
    assert.strictEqual(false, wnd2.isMaster);
    done();
  });

  it('releases the masterness after destroy()', function(done) {
    wnd1.live.destroy();
    wait(function() { return wnd2.isMaster; }, function() {
      assert.strictEqual(false, wnd1.isMaster);
      assert.strictEqual(true, wnd2.isMaster);
      done();
    });
  });

  it('does not pretends on master after destroy', function(done) {
    [ wnd2, wnd1 ].forEach(function(wnd) {
      wnd.live.destroy();
      wnd.isMaster = false;
    });
    setTimeout(function() {
      assert.strictEqual(false, wnd1.isMaster);
      assert.strictEqual(false, wnd2.isMaster);
      done();
    }, 1000);
  });

  it('can be re-created after destroy', function(done) {
    wnd1.live.destroy();
    wait(function() { return wnd2.isMaster; }, function() {
      wnd1.setTabex();
      wait(function() { return wnd1.isMaster; }, done);
      wnd2.live.destroy();
    });
  });
});
