var app = require('ampersand-app');
var Router = require('ampersand-router');
var HomePage = require('./pages/home');
var FeaturesPage = require('./pages/features');
var ContactPage = require('./pages/contact');


module.exports = Router.extend({
    routes: {
        'muk/': 'home',
        'muk/features': 'features',
        'muk/contact': 'contact',
        '(*path)': 'catchAll'
    },

    // ------- ROUTE HANDLERS ---------
    home: function () {
        app.trigger('page', new HomePage({
            model: app.me
        }));
    },

    features: function () {
        app.trigger('page', new FeaturesPage({
            model: app.me,
            collection: app.featureCollection
        }));
    },

    contact: function () {
        app.trigger('page', new ContactPage({
            model: app.me
        }));
    },

    catchAll: function () {
        this.redirectTo(app.contextPath + '');
    }
});
