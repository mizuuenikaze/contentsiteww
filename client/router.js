var app = require('ampersand-app');
var Router = require('ampersand-router');
var MassagePage = require('./pages/massage');
var SchedulePage = require('./pages/schedule');


module.exports = Router.extend({
	routes: {
		'massage/': 'home',
		'massage/schedule': 'schedule',
		'(*path)': 'catchAll'
	},

	// ------- ROUTE HANDLERS ---------
	home: function () {
		app.trigger('page', new MassagePage({
			model: app.pageContext
		}));
	},
	
	schedule: function () {
		app.trigger('page', new SchedulePage({
			model: app.pageContext
		}));
	},

	catchAll: function () {
		this.redirectTo(app.contextPath + '');
	}
});
