var app = require('ampersand-app');
var _ = require('lodash');
var config = require('clientconfig');
var Router = require('./router');
var MainView = require('./views/main');
var Me = require('./models/me');
var domReady = require('domready');
var browser = require('detect-browser');
var scriptLoad = require('scriptloader');

// Defer lazysizes
window.lazySizesConfig = { init: false, loadMode: 3 };
var lazysizes = require('./util/lazysizes');
var holder = require('./util/holder');
holder.run({domain: 'preempt'});

// attach our app to `window` so we can
// easily access it from the console.
window.app = app;

// Extends our main app singleton
app.extend({
	contextPath: window.location.pathname.match(/(\/[^\/]+){1}/, '')[0] + '/',
    me: new Me(),
	apiBaseUri: config.apiUrl,
    router: new Router(),
    // This is where it all starts
    init: function() {

        // Create and attach our main view
        this.mainView = new MainView({
            model: this.me,
            el: document.body
        });

        // this kicks off our backbutton tracking (browser history)
        // and will cause the first matching handler in the router
        // to fire.
        this.router.history.start([{ pushState: true},{root: this.contextPath}]);
    },
    // This is a helper for navigating around the app.
    // this gets called by a global click handler that handles
    // all the <a> tags in the app.
    // it expects a url pathname for example: "/costello/settings"
    navigate: function(page) {
        var url = (page.charAt(0) === '/') ? page.slice(1) : page;
        this.router.history.navigate(url, {
            trigger: true
        });
    },
	configureAjax: function () {
		var useXDR = /IE/.test(browser.name);
		var headers = {Accept: 'application/json'};
		var xhrFields = {withCredentials: false};

		if (this.me.token !== '') {
			headers.Authorization = 'Bearer ' + this.me.token;
			xhrFields.withCredentials = true;
		}

		return { useXDR: useXDR, headers: headers, xhrFields: xhrFields };
	},
	reInitModules: function() {
		// refresh bootstrap objects
		var bootstrapNativeInit = require('bootstrap.native');

		// check for new placeholders
		holder.run({domain:'holderjs'});

		// lazysizes is okay to run anytime except in this case
		// where it has to run after holderjs the first time.
		lazysizes.init();
	},
	injectScripts: function() {
		// can't take advantage of cdn in this case.  Must be used in required fashion
		//scriptLoad(document, 'https://cdnjs.cloudflare.com/ajax/libs/bootstrap.native/2.0.10/bootstrap-native.js');

		// would like to do this to offload third party script from the main js bundle, but not finding good opportunities.
	}
});


// run it on domReady
domReady(_.bind(app.init, app));
