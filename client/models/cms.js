var AmpersandModel = require('ampersand-model');
var app = require('ampersand-app');


module.exports = AmpersandModel.extend({
	props: {
		id: ['string', 'true', ''],
		page: 'object'
	},
	ajaxConfig: app.configureAjax,
	initialize: function (attrs) {
		this.urlRoot = app.apiBaseUri + '/v1/cms';
	}
});
