"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var express_1 = require("express");
var promisify = require('util').promisify;
var crypto = require("crypto");
var nodemailer = require("nodemailer");
var passport = require("passport");
var User = require('../config/User2');
var randomBytesAsync = promisify(crypto.randomBytes);
var UserController = /** @class */ (function () {
    function UserController() {
        this.router = express_1.Router();
        this.routes;
    }
    UserController.prototype.routes = function () {
        var _this = this;
        /**
         * GET /login
         */
        this.router.get('/login', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.user) {
                    return [2 /*return*/, res.redirect('/')];
                }
                res.render('account/login', {
                    title: 'Login'
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /login
         * Sign in using email and password.
         */
        this.router.post('/login', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                req.assert('email', 'Email is not valid').isEmail();
                req.assert('password', 'Password cannot be blank').notEmpty();
                req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/login')];
                }
                passport.authenticate('local', function (err, user, info) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        req.flash('errors', info);
                        return res.redirect('/login');
                    }
                    req.logIn(user, function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.flash('success', { msg: 'Success! You are logged in.' });
                        res.redirect(req.session.returnTo || '/');
                    });
                })(req, res, next);
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /logout
         */
        this.router.get('/logout', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                req.logout();
                req.session.destroy(function (err) {
                    if (err)
                        console.log('Error : Failed to destroy the session during logout.', err);
                    req.user = null;
                    res.redirect('/');
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /signup
         */
        this.router.get('/signup', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.user) {
                    return [2 /*return*/, res.redirect('/')];
                }
                res.render('account/signup', {
                    title: 'Create Account'
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /signup
         */
        this.router.post('/signup', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors, user;
            return __generator(this, function (_a) {
                req.assert('email', 'Email is not valid').isEmail();
                req.assert('password', 'Password must be at least 4 characters long').len(4);
                req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
                req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/signup')];
                }
                user = new User({
                    email: req.body.email,
                    password: req.body.password
                });
                User.findOne({ email: req.body.email }, function (err, existingUser) {
                    if (err) {
                        return next(err);
                    }
                    if (existingUser) {
                        req.flash('errors', { msg: 'Account with that email address already exists.' });
                        return res.redirect('/signup');
                    }
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.logIn(user, function (err) {
                            if (err) {
                                return next(err);
                            }
                            res.redirect('/');
                        });
                    });
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /account
         */
        this.router.get('/account', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.render('account/profile', {
                    title: 'Account Management'
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /account/profile
         */
        this.router.post('/account/profile', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                req.assert('email', 'Please enter a valid email address.').isEmail();
                req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/account')];
                }
                User.findById(req.user.id, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    user.email = req.body.email || '';
                    user.profile.name = req.body.name || '';
                    user.profile.gender = req.body.gender || '';
                    user.profile.location = req.body.location || '';
                    user.profile.website = req.body.website || '';
                    user.save(function (err) {
                        if (err) {
                            if (err.code === 11000) {
                                req.flash('errors', { msg: 'The email address you have entered is already associated with an account.' });
                                return res.redirect('/account');
                            }
                            return next(err);
                        }
                        req.flash('success', { msg: 'Profile information has been updated.' });
                        res.redirect('/account');
                    });
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /account/password
         */
        this.router.post('/account/password', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors;
            return __generator(this, function (_a) {
                req.assert('password', 'Password must be at least 4 characters long').len(4);
                req.assert('confirmPassword', 'Passwords do not match').equals(req.body.password);
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/account')];
                }
                User.findById(req.user.id, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    user.password = req.body.password;
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.flash('success', { msg: 'Password has been changed.' });
                        res.redirect('/account');
                    });
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /account/delete
         */
        this.router.post('/account/delete', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                User.deleteOne({ _id: req.user.id }, function (err) {
                    if (err) {
                        return next(err);
                    }
                    req.logout();
                    req.flash('info', { msg: 'Your account has been deleted.' });
                    res.redirect('/');
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /account/unlink/:provider
         */
        this.router.get('/account/unlink/:provider', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var provider;
            return __generator(this, function (_a) {
                provider = req.params.provider;
                User.findById(req.user.id, function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    user[provider] = undefined;
                    user.tokens = user.tokens.filter(function (token) { return token.kind !== provider; });
                    user.save(function (err) {
                        if (err) {
                            return next(err);
                        }
                        req.flash('info', { msg: provider + " account has been unlinked." });
                        res.redirect('/account');
                    });
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /reset/:token
         */
        this.router.get('/reset/:token', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.isAuthenticated()) {
                    return [2 /*return*/, res.redirect('/')];
                }
                User
                    .findOne({ passwordResetToken: req.params.token })
                    .where('passwordResetExpires').gt(Date.now())
                    .exec(function (err, user) {
                    if (err) {
                        return next(err);
                    }
                    if (!user) {
                        req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                        return res.redirect('/forgot');
                    }
                    res.render('account/reset', {
                        title: 'Password Reset'
                    });
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /reset/:token
         */
        this.router.post('/reset/:token', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors, resetPassword, sendResetPasswordEmail;
            return __generator(this, function (_a) {
                req.assert('password', 'Password must be at least 4 characters long.').len(4);
                req.assert('confirm', 'Passwords must match.').equals(req.body.password);
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('back')];
                }
                resetPassword = function () {
                    return User
                        .findOne({ passwordResetToken: req.params.token })
                        .where('passwordResetExpires').gt(Date.now())
                        .then(function (user) {
                        if (!user) {
                            req.flash('errors', { msg: 'Password reset token is invalid or has expired.' });
                            return res.redirect('back');
                        }
                        user.password = req.body.password;
                        user.passwordResetToken = undefined;
                        user.passwordResetExpires = undefined;
                        return user.save().then(function () { return new Promise(function (resolve, reject) {
                            req.logIn(user, function (err) {
                                if (err) {
                                    return reject(err);
                                }
                                resolve(user);
                            });
                        }); });
                    });
                };
                sendResetPasswordEmail = function (user) {
                    if (!user) {
                        return;
                    }
                    var transporter = nodemailer.createTransport({
                        service: 'SendGrid',
                        auth: {
                            user: process.env.SENDGRID_USER,
                            pass: process.env.SENDGRID_PASSWORD
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: 'hackathon@starter.com',
                        subject: 'Your Hackathon Starter password has been changed',
                        text: "Hello,\n\nThis is a confirmation that the password for your account " + user.email + " has just been changed.\n"
                    };
                    return transporter.sendMail(mailOptions)
                        .then(function () {
                        req.flash('success', { msg: 'Success! Your password has been changed.' });
                    })
                        .catch(function (err) {
                        if (err.message === 'self signed certificate in certificate chain') {
                            console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                            transporter = nodemailer.createTransport({
                                service: 'SendGrid',
                                auth: {
                                    user: process.env.SENDGRID_USER,
                                    pass: process.env.SENDGRID_PASSWORD
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
                            return transporter.sendMail(mailOptions)
                                .then(function () {
                                req.flash('success', { msg: 'Success! Your password has been changed.' });
                            });
                        }
                        console.log('ERROR: Could not send password reset confirmation email after security downgrade.\n', err);
                        req.flash('warning', { msg: 'Your password has been changed, however we were unable to send you a confirmation email. We will be looking into it shortly.' });
                        return err;
                    });
                };
                resetPassword()
                    .then(sendResetPasswordEmail)
                    .then(function () { if (!res.finished)
                    res.redirect('/'); })
                    .catch(function (err) { return next(err); });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /forgot
         */
        this.router.get('/forgot', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                if (req.isAuthenticated()) {
                    return [2 /*return*/, res.redirect('/')];
                }
                res.render('account/forgot', {
                    title: 'Forgot Password'
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /forgot
         * Create a random token, then the send user an email with a reset link.
         */
        this.router.post('/forgot', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var errors, createRandomToken, setRandomToken, sendForgotPasswordEmail;
            return __generator(this, function (_a) {
                req.assert('email', 'Please enter a valid email address.').isEmail();
                req.sanitize('email').normalizeEmail({ gmail_remove_dots: false });
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/forgot')];
                }
                createRandomToken = randomBytesAsync(16)
                    .then(function (buf) { return buf.toString('hex'); });
                setRandomToken = function (token) {
                    return User
                        .findOne({ email: req.body.email })
                        .then(function (user) {
                        if (!user) {
                            req.flash('errors', { msg: 'Account with that email address does not exist.' });
                        }
                        else {
                            user.passwordResetToken = token;
                            user.passwordResetExpires = Date.now() + 3600000; // 1 hour
                            user = user.save();
                        }
                        return user;
                    });
                };
                sendForgotPasswordEmail = function (user) {
                    if (!user) {
                        return;
                    }
                    var token = user.passwordResetToken;
                    var transporter = nodemailer.createTransport({
                        service: 'SendGrid',
                        auth: {
                            user: process.env.SENDGRID_USER,
                            pass: process.env.SENDGRID_PASSWORD
                        }
                    });
                    var mailOptions = {
                        to: user.email,
                        from: 'hackathon@starter.com',
                        subject: 'Reset your password on Hackathon Starter',
                        text: "You are receiving this email because you (or someone else) have requested the reset of the password for your account.\n\n\n        Please click on the following link, or paste this into your browser to complete the process:\n\n\n        http://" + req.headers.host + "/reset/" + token + "\n\n\n        If you did not request this, please ignore this email and your password will remain unchanged.\n"
                    };
                    return transporter.sendMail(mailOptions)
                        .then(function () {
                        req.flash('info', { msg: "An e-mail has been sent to " + user.email + " with further instructions." });
                    })
                        .catch(function (err) {
                        if (err.message === 'self signed certificate in certificate chain') {
                            console.log('WARNING: Self signed certificate in certificate chain. Retrying with the self signed certificate. Use a valid certificate if in production.');
                            transporter = nodemailer.createTransport({
                                service: 'SendGrid',
                                auth: {
                                    user: process.env.SENDGRID_USER,
                                    pass: process.env.SENDGRID_PASSWORD
                                },
                                tls: {
                                    rejectUnauthorized: false
                                }
                            });
                            return transporter.sendMail(mailOptions)
                                .then(function () {
                                req.flash('info', { msg: "An e-mail has been sent to " + user.email + " with further instructions." });
                            });
                        }
                        console.log('ERROR: Could not send forgot password email after security downgrade.\n', err);
                        req.flash('errors', { msg: 'Error sending the password reset message. Please try again shortly.' });
                        return err;
                    });
                };
                createRandomToken
                    .then(setRandomToken)
                    .then(sendForgotPasswordEmail)
                    .then(function () { return res.redirect('/forgot'); })
                    .catch(next);
                return [2 /*return*/];
            });
        }); });
    };
    return UserController;
}());
exports.UserController = UserController;
var UserRoutes = new UserController();
UserRoutes.routes();
exports.default = UserRoutes.router;
