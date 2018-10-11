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
var promisify = require('util').promisify;
var request = require('request');
var stripe = require('stripe')(process.env.STRIPE_SKEY);
var express_1 = require("express");
var ApiController = /** @class */ (function () {
    function ApiController() {
        this.router = express_1.Router();
        this.routes;
    }
    ApiController.prototype.routes = function () {
        var _this = this;
        /**
         * GET /api
         * List of API examples.
         */
        this.router.get('/', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.render('api/index', {
                    title: 'API Examples'
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * GET /api/stripe
         * Stripe API example.
         */
        this.router.get('/stripe', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                res.render('api/stripe', {
                    title: 'Stripe API',
                    publishableKey: process.env.STRIPE_PKEY
                });
                return [2 /*return*/];
            });
        }); });
        /**
         * POST /api/stripe
         * Make a payment.
         */
        this.router.post('/stripe', function (req, res, next) { return __awaiter(_this, void 0, void 0, function () {
            var _a, stripeToken, stripeEmail;
            return __generator(this, function (_b) {
                _a = req.body, stripeToken = _a.stripeToken, stripeEmail = _a.stripeEmail;
                stripe.charges.create({
                    amount: 395,
                    currency: 'usd',
                    source: stripeToken,
                    description: stripeEmail
                }, function (err) {
                    if (err && err.type === 'StripeCardError') {
                        req.flash('errors', { msg: 'Your card has been declined.' });
                        return res.redirect('/api/stripe');
                    }
                    req.flash('success', { msg: 'Your card has been successfully charged.' });
                    res.redirect('/api/stripe');
                });
                return [2 /*return*/];
            });
        }); });
    };
    return ApiController;
}());
exports.ApiController = ApiController;
var ApiRoutes = new ApiController();
ApiRoutes.routes();
exports.default = ApiRoutes.router;
