var PageView = require('./base');
var templates = require('../templates');
var _ = require('lodash');
var CalendarRequestForm = require('../forms/calendarRequest');
var app = require('ampersand-app');
var dom = require('ampersand-dom');


module.exports = PageView.extend({
	pageTitle: 'schedule',
	template: templates.pages.schedule,
	cmsId:'7d9ac72016b84dea835bf2d90630e719',
	bindings: {
		'model.cms.page.a.a': {type: 'text', hook: 'outl-a.a'},
		'model.cms.page.a.b': {type: 'text', hook: 'outl-a.b'},
		'model.cms.page.a.c': {type: 'text', hook: 'outl-a.c'}
	},
	events: {
		'click [data-hook=request]': 'launchRequest',
		'click [data-hook=check]': 'checkStatus'
	},
	initialize: function (attrs) {
		this.listenTo(app, 'appointmentRequested', this.closeRequest);
	},
	bindUiTo: function (external) {
		if (external === 'bootstrap') {
			this.requestModal = new window.Modal(this.queryByHook('schedule'), {backdrop: 'static'});
		}
	},
	launchRequest: function () {
		this.requestModal.show();
	},
	closeRequest: function () {
		dom.removeClass(this.queryByHook('check'), 'invisible');
		dom.addClass(this.queryByHook('request'), 'invisible');
		this.requestModal.hide();
	},
	resetRequest: function () {
		this.setErrorMessage('');
		this.model.appointmentResponse.clear();
		dom.removeClass(this.queryByHook('request'), 'invisible');
		dom.addClass(this.queryByHook('check'), 'invisible');
		app.router.reload();
	},
	checkStatus: function (e) {
		this.model.appointmentResponse.fetch({
			pageView: this,
			success: function (model, response, options) {
				if (model.status === 1) {
					dom.removeClass(e.target, 'btn-warning');
					dom.addClass(e.target, 'btn-success');
					_.delay(options.pageView.resetRequest.bind(options.pageView), 3000);
				} else if (model.status === 2) {
					dom.removeClass(e.target, 'btn-warning');
					dom.addClass(e.target, 'btn-danger');

					if (model.message) {
						options.pageView.setErrorMessage(message);
					} else {
						options.pageView.setErrorMessage('Request was not sent succesfully.');
					}

					_.delay(options.pageView.resetRequest.bind(options.pageView), 3000);
				} else {
					e.target.textContent = 'working...check again';
				}
			},
			error: function (model, response, options) {
				options.pageView.setErrorMessage(response.rawRequest.responseText);
			}
		});
	},
	subviews: {
		form: {
			hook: 'schedule-request-form',
			waitFor: 'model',
			prepareView: function (el) {
				return new CalendarRequestForm({
					el: el,
					model: this.model.appointmentResponse,
					submitCallback: function (data) {
						var formModel = this.model;
						var start = new Date(data.sessionDay + ' ' + data.start);
						var end = new Date(data.sessionDay + ' ' + data.end);
						data.start = start.toISOString();
						data.end = end.toISOString();
						_.unset(data, 'sessionDay');

						return window.fetch(app.apiBaseUri + '/v1/appointments',
							app.fetchMerge({
								method: 'POST',
								body: JSON.stringify(data)
							})
						).then(app.peelFetchResponse
						).then(function (body) {
							formModel.id = body.id;
							formModel.status = body.status;
							formModel.message = body.message ? body.message : '';
							formModel.urlRoot = app.apiBaseUri + body.links[0].href;
							app.trigger('appointmentRequested');
						}).catch(app.handleError);
					}
				});
			}
		}
	}
});
