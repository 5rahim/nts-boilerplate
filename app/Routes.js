"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var dotenv = require("dotenv");
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });
var express_1 = require("express");
var Api_1 = require("../controllers/Api");
var Home_1 = require("../controllers/Home");
var User_1 = require("../controllers/User");
var Contact_1 = require("../controllers/Contact");
var path = require('path');
var multer = require('multer');
var upload = multer({ dest: path.join(__dirname, 'uploads') });
var Routes = /** @class */ (function () {
    function Routes() {
    }
    Routes.prototype.initialize = function (app, passport, PassportConfig) {
        var router;
        router = express_1.Router();
        // Locals
        //Locals.init(app)
        // Routes
        app.use('/', Home_1.default);
        app.use('/', User_1.default);
        app.use('/contact', Contact_1.default);
        app.use('/api', Api_1.default);
        /**
         * OAuth authentication routes. (Sign in)
         */
        app.get('/auth/instagram', passport.authenticate('instagram'));
        app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
        app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/github', passport.authenticate('github'));
        app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/twitter', passport.authenticate('twitter'));
        app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
        app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), function (req, res) {
            res.redirect(req.session.returnTo || '/');
        });
    };
    return Routes;
}());
exports.Routes = Routes;
exports.default = new Routes;
