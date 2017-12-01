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
    function trackMasterness(wnd) {
      wnd.live.on('!sys.master', function (data) {
        wnd.masterEvent = true;
        wnd.isMaster = data.node_id === data.master_id;
      });
    }

    wnd1 = window.open('fixtures/client_local.html', 'client_local_wnd1');
    wait(function() { return wnd1.live; }, function() {
      trackMasterness(wnd1);
      wnd2 = window.open('fixtures/client_local.html', 'client_local_wnd2');
      wait(function() { return wnd2.live; }, function() {
        trackMasterness(wnd2);
        wait(function() { return wnd1.masterEvent && wnd2.masterEvent; }, done);
      });
    });
  }

  before(initWindows);

  after(function () {
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
});
