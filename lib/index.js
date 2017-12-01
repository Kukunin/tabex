'use strict';


var Router = require('./router');
var Client = require('./client');
var Tunnel = require('./tunnel');


var Tabex = { _: {} };


// Expose classes for testing
//
Tabex._.Router = Router;
Tabex._.Client = Client;
Tabex._.Tunnel = Tunnel;


// Create client
//
Tabex.client = function (options) {
  options = options || {};

  var namespace = options.namespace || 'tabex_default_';

  var router;

  // If router in iframe (cross-domain) - create tunnel
  if (options.iframe) {
    router = new Tunnel.TunnelClient(options);

  // If router is local (single-domain)
  } else {
    router = new Router({ namespace: namespace });
  }

  return new Client({ router: router });
};


// Create router
//
Tabex.router = function (options) {
  options = options || {};

  var namespace = options.namespace || 'tabex_default_';

  var router = new Router({ namespace: namespace });

  // Create tunnel to communicate between router and client
  /* eslint-disable no-new */
  new Tunnel.TunnelRouter({
    router: router,
    namespace: namespace,
    origin: options.origin
  });

  return router;
};

module.exports = Tabex;
