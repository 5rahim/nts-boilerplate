import * as dotenv from 'dotenv';
/**
 * Load environment variables from .env file, where API keys and passwords are configured.
 */
dotenv.load({ path: '.env.example' });

import { Router } from 'express'

import ApiController from '../controllers/Api'
import HomeController from '../controllers/Home'
import UserController from '../controllers/User'
import ContactController from '../controllers/Contact'

const path = require('path');
const multer = require('multer');

const upload = multer({ dest: path.join(__dirname, 'uploads') })

export class Routes {

    public initialize(app, passport, PassportConfig) {

        let router: Router;
        router = Router();

        // Locals
        //Locals.init(app)

        // Routes
        app.use('/', HomeController);
        app.use('/', UserController);
        app.use('/contact', ContactController);

        app.use('/api', ApiController)

        /**
         * OAuth authentication routes. (Sign in)
         */
        app.get('/auth/instagram', passport.authenticate('instagram'));
        app.get('/auth/instagram/callback', passport.authenticate('instagram', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/facebook', passport.authenticate('facebook', { scope: ['email', 'public_profile'] }));
        app.get('/auth/facebook/callback', passport.authenticate('facebook', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/github', passport.authenticate('github'));
        app.get('/auth/github/callback', passport.authenticate('github', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/google', passport.authenticate('google', { scope: 'profile email' }));
        app.get('/auth/google/callback', passport.authenticate('google', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/twitter', passport.authenticate('twitter'));
        app.get('/auth/twitter/callback', passport.authenticate('twitter', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });
        app.get('/auth/linkedin', passport.authenticate('linkedin', { state: 'SOME STATE' }));
        app.get('/auth/linkedin/callback', passport.authenticate('linkedin', { failureRedirect: '/login' }), (req, res) => {
            res.redirect(req.session.returnTo || '/');
        });

    }

}

export default new Routes;