var FormView = require('ampersand-form-view');
var InputView = require('ampersand-input-view');
var SelectView = require('ampersand-select-view');
var templates = require('../templates');
var _ = require('lodash');
var app = require('ampersand-app');
var ExtendedInput = InputView.extend({
	template: templates.includes.formInput()
});
var ExtendedSelect = SelectView.extend({
	template: templates.includes.formSelect()
});
var ExtendedTextArea = InputView.extend({
	template: templates.includes.formTextArea()
});
var ExtendedDateInput = InputView.extend({
	template: templates.includes.formInput(),
	props: {
		min: ['string', false],
		max: ['string', false],
		pattern: ['string', false]
	},
	bindings: _.extend({}, InputView.prototype.bindings, {
		'min': {
			type: 'attribute',
			selector: 'input',
			name: 'min'
		},
		'max': {
			type: 'attribute',
			selector: 'input',
			name: 'max'
		},
		'pattern': {
			type: 'attribute',
			selector: 'input',
			name: 'pattern'
		}
	})
});
var ExtendedTimeInput = InputView.extend({
	template: templates.includes.formInput(),
	props: {
		step: ['string', true, 'any'],
		pattern: ['string', false]
	},
	bindings: _.extend({}, InputView.prototype.bindings, {
		'step': {
			type: 'attribute',
			selector: 'input, textarea',
			name: 'step'
		},
		'pattern': {
			type: 'attribute',
			selector: 'input',
			name: 'pattern'
		}
	})
});


module.exports = FormView.extend({
	fields: function () {
		var today = new Date();
		today.setHours(0,0,0,0);
		var tomorrow = new Date(today);
		var twoMonthsFromNow = new Date(today);
		tomorrow.setDate(tomorrow.getDate() + 1);
		tomorrow.setTime(23,59,59,0);
		twoMonthsFromNow.setDate(twoMonthsFromNow.getDate() + 60);

		return [
			new ExtendedInput({
				label:'Email',
				name: 'who',
				type: 'email',
				placeholder: 'jqpublic@gmail.com',
				required: true,
				parent: this
			}),
			new ExtendedSelect({
				label: 'Service',
				name: 'what',
				required: true,
				parent: this,
				options: [['table', 'table massage'], ['chair', 'chair massage'], ['other', 'other']]
			}),
			new ExtendedDateInput({
				label: 'Requested Session Day',
				name: 'sessionDay',
				type: 'date',
				required: true,
				placeholder: app.dateFormat(tomorrow),
				min: app.dateFormat(tomorrow),
				max: app.dateFormat(twoMonthsFromNow),
				pattern: '[0-9]{4}/[0-9]{2}/[0-9]{2}',
				parent: this,
				tests: [
					function (val) {
						var valDate = new Date(val);
						if (1 > app.dateDiff('d', today, valDate)) {
							return 'Sorry, no same day appointments.';
						}
					},
					function (val) {
						var valDate = new Date(val);
						if (10 < app.dateDiff('w', today, valDate)) {
							return 'Don\'t go more than two months out on your request, thanks.';
						}
					}
				]
			}),
			new ExtendedTimeInput({
				label: 'start',
				name: 'start',
				type: 'time',
				step: '1800',
				placeholder: '06:30 PM',
				required: true,
				pattern: '[0-9]{2}:[0-9]{2}( AM| PM)?',
				parent: this,
				tests: [
					function (val) {
						if (!(/[0-9]{2}:[0-9]{2}( AM| PM)?/.test(val))) {
							return 'Enter a valid time like 06:30 PM.';
						}
					}
				]
			}),
			new ExtendedTimeInput({
				label: 'end',
				name: 'end',
				type: 'time',
				step: '1800',
				placeholder: '06:30 PM',
				required: true,
				pattern: '[0-9]{2}:[0-9]{2}( AM| PM)?',
				parent: this,
				tests: [
					function (val) {
						if (!(/[0-9]{2}:[0-9]{2}( AM| PM)?/.test(val))) {
							return 'Enter a valid time like 06:30 PM.';
						}
					}
				]
			}),
			new ExtendedInput({
				label: 'Location',
				name: 'where',
				type: 'text',
				placeholder: 'North Austin',
				required: false,
				parent: this
			}),
			new ExtendedTextArea({
				label: 'Notes',
				name: 'why',
				type: 'text',
				required: false,
				parent: this
			})
		];
	}
});

