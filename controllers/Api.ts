const { promisify } = require('util');
const request = require('request');
const stripe = require('stripe')(process.env.STRIPE_SKEY);

import {Router, Request, Response, NextFunction} from 'express';

export class ApiController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes;
    }

    public routes() {

        /**
         * GET /api
         * List of API examples.
         */
        this.router.get('/', async (req: any, res, next) => {
            res.render('api/index', {
                title: 'API Examples'
            });
        });



        /**
         * GET /api/stripe
         * Stripe API example.
         */
        this.router.get('/stripe', async (req: any, res, next) => {
            res.render('api/stripe', {
                title: 'Stripe API',
                publishableKey: process.env.STRIPE_PKEY
            });
        });

        /**
         * POST /api/stripe
         * Make a payment.
         */
        this.router.post('/stripe', async (req: any, res, next) => {
            const { stripeToken, stripeEmail } = req.body;
            stripe.charges.create({
                amount: 395,
                currency: 'usd',
                source: stripeToken,
                description: stripeEmail
            }, (err) => {
                if (err && err.type === 'StripeCardError') {
                    req.flash('errors', { msg: 'Your card has been declined.' });
                    return res.redirect('/api/stripe');
                }
                req.flash('success', { msg: 'Your card has been successfully charged.' });
                res.redirect('/api/stripe');
            });
        });

    }

}

const ApiRoutes = new ApiController();
ApiRoutes.routes();

export default ApiRoutes.router;