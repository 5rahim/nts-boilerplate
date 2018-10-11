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
var nodemailer = require('nodemailer');
var express_1 = require("express");
var ContactController = /** @class */ (function () {
    function ContactController() {
        this.router = express_1.Router();
    }
    ContactController.prototype.routes = function () {
        var _this = this;
        /**
         * GET /contact
         * Contact form page.
         */
        this.router.get('/', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var unknownUser;
            return __generator(this, function (_a) {
                unknownUser = !(req.user);
                res.render('contact', {
                    title: 'Contact',
                    unknownUser: unknownUser,
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /contact
         * Send a contact form via Nodemailer.
         */
        this.router.post('/', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var fromName, fromEmail, errors, transporter, mailOptions;
            return __generator(this, function (_a) {
                if (!req.user) {
                    req.assert('name', 'Name cannot be blank').notEmpty();
                    req.assert('email', 'Email is not valid').isEmail();
                }
                req.assert('message', 'Message cannot be blank').notEmpty();
                errors = req.validationErrors();
                if (errors) {
                    req.flash('errors', errors);
                    return [2 /*return*/, res.redirect('/contact')];
                }
                if (!req.user) {
                    fromName = req.body.name;
                    fromEmail = req.body.email;
                }
                else {
                    fromName = req.user.profile.name || '';
                    fromEmail = req.user.email;
                }
                transporter = nodemailer.createTransport({
                    service: 'SendGrid',
                    auth: {
                        user: process.env.SENDGRID_USER,
                        pass: process.env.SENDGRID_PASSWORD
                    }
                });
                mailOptions = {
                    to: 'bonfohzaki@gmail.com',
                    from: fromName + " <" + fromEmail + ">",
                    subject: 'Contact Form | Hackathon Starter',
                    text: req.body.message
                };
                return [2 /*return*/, transporter.sendMail(mailOptions)
                        .then(function () {
                        req.flash('success', { msg: 'Email has been sent successfully!' });
                        res.redirect('/contact');
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
                            return transporter.sendMail(mailOptions);
                        }
                        console.log('ERROR: Could not send contact email after security downgrade.\n', err);
                        req.flash('errors', { msg: 'Error sending the message. Please try again shortly.' });
                        return false;
                    })
                        .then(function (result) {
                        if (result) {
                            req.flash('success', { msg: 'Email has been sent successfully!' });
                            return res.redirect('/contact');
                        }
                    })
                        .catch(function (err) {
                        console.log('ERROR: Could not send contact email.\n', err);
                        req.flash('errors', { msg: 'Error sending the message. Please try again shortly.' });
                        return res.redirect('/contact');
                    })];
            });
        }); });
    };
    return ContactController;
}());
exports.ContactController = ContactController;
var ContactRoutes = new ContactController();
ContactRoutes.routes();
exports.default = ContactRoutes.router;
