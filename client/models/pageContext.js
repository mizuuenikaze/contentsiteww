/*
 * PageContext
 * Composite model consiting of:
 * 	1. Me - user info
 * 	2. Cms - couchdb page content.
 * 	3. Schedule response - action task id to lookup later
 */

var AmpersandModel = require('ampersand-model');
var Me = require('./me');
var Cms = require('./cms');
var AsyncTask = require('./asyncTask');

module.exports = AmpersandModel.extend({
	children: {
		me: Me,
		cms: Cms,
		appointmentResponse: AsyncTask
	},
	initialize: function (options) {
		this.set({me: {STORAGE_KEY: 'mukuser_v1'}});
	}
});
