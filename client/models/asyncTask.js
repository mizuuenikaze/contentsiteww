var AmpersandModel = require('ampersand-model');
var app = require('ampersand-app');


module.exports = AmpersandModel.extend({
	props: {
		id: ['string', 'true', ''],
		status: ['number', 'false', 0],
		message: ['string', 'false', '']
	},
	initialize: function (attrs) {
		this.ajaxConfig = app.configureAjax.bind(app);
		this.urlRoot = app.apiBaseUri + '/v1/action/tasks';
	}
});
