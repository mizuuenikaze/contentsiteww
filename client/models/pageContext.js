/*
 * PageContext
 * Composite model consiting of:
 * 	1. Me - user info
 * 	2. Cms - couchdb page content.
 */

var AmpersandModel = require('ampersand-model');
var Me = require('./me');
var Cms = require('./cms');

module.exports = AmpersandModel.extend({
	children: {
		me: Me,
		cms: Cms
	},
	initialize: function (options) {
		this.set({me: {STORAGE_KEY: 'mukuser_v1'}});
	}
});
