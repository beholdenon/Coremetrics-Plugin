window.bl = window.bl || {};

(function(ns) {
	// get current host
    var host = window.location.host;

    // production urls
    var PRODUCTION_URLS = [
        "fashion.bloomingdales.com",
        "www.bloomingdales.com",
        "m.bloomingdales.com"
    ];

	ns.log = function(msg) {
		if (window.console && PRODUCTION_URLS.indexOf(host) === -1) {
            console.log(msg);
        }
	}
	ns.extend = function(a, b) {
		for(var key in b)
        if(b.hasOwnProperty(key))
        a[key] = b[key];
        return a;
	}
	ns.forEach = function (array, callback, scope) {
		for (var i = 0; i < array.length; i++) {
            callback.call(scope, i, array[i]); // passes back stuff we need
        }
	}
})(window.bl.utils = window.bl.utils || {});