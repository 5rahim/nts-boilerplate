/**
 * Module dependencies.
 */
import * as express from 'express'
import * as compression from 'compression'
import * as session from 'express-session'
import * as bodyParser from 'body-parser'
import * as logger from 'morgan'
import * as chalk from 'chalk'
import * as errorHandler from 'errorhandler'
import * as lusca from 'lusca'
import * as dotenv from 'dotenv'
const MongoStore = require('connect-mongo')(session)
import * as flash from 'express-flash'
import * as path from 'path'
import * as mongoose from 'mongoose'
const passport = require('passport')
import * as expressValidator from 'express-validator'
import * as expressStatusMonitor from 'express-status-monitor'
import * as sass from 'node-sass-middleware'
import * as multer from 'multer'


import Routes from "./app/Routes";

const upload = multer({ dest: path.join(__dirname, 'uploads') });

// Process ENV
process.env.BASE = __dirname + '/';

class App {

    public app: express.Application;

    constructor() {
        this.app = express();
        this.config();
        //this.routes();
    }


    public config(): any {

        dotenv.load({ path: '.env.example' });
        /**
         * API keys and Passport configuration.
         */
        const PassportConfig = require('./config/Passport');

        /**
         * Connect to MongoDB.
         */
        mongoose.set('useFindAndModify', false);
        mongoose.set('useCreateIndex', true);
        mongoose.set('useNewUrlParser', true);
        mongoose.connect(process.env.MONGODB_URI);
        mongoose.connection.on('error', (err) => {
            console.error(err);
            //console.log('%s MongoDB connection error. Please make sure MongoDB is running.', chalk.red('✗'));
            console.log('%s MongoDB connection error. Please make sure MongoDB is running.');
            process.exit();
        });

        /**
         * Express configuration.
         */
        this.app.set('host', process.env.OPENSHIFT_NODEJS_IP || '0.0.0.0');
        this.app.set('port', process.env.PORT || process.env.OPENSHIFT_NODEJS_PORT || 8080);
        this.app.set('views', path.join(__dirname, 'views'));
        this.app.set('view engine', 'pug');
        this.app.use(expressStatusMonitor());
        this.app.use(compression());
        this.app.use(sass({
            src: path.join(__dirname, 'public'),
            dest: path.join(__dirname, 'public')
        }));
        this.app.use(logger('dev'));
        this.app.use(bodyParser.json());
        this.app.use(bodyParser.urlencoded({ extended: true }));
        this.app.use(expressValidator());
        this.app.use(session({
            resave: true,
            saveUninitialized: true,
            secret: process.env.SESSION_SECRET,
            cookie: { maxAge: 1209600000 }, // two weeks in milliseconds
            store: new MongoStore({
                url: process.env.MONGODB_URI,
                autoReconnect: true,
            })
        }));
        this.app.use(passport.initialize());
        this.app.use(passport.session());
        this.app.use(flash());
        this.app.use((req: any, res: any, next) => {
            if (req.path === '/api/upload') {
                next();
            } else {
                lusca.csrf()(req, res, next);
            }
        });
        this.app.use(lusca.xframe('SAMEORIGIN'));
        this.app.use(lusca.xssProtection(true));
        this.app.disable('x-powered-by');
        this.app.use((req: any, res: any, next) => {
            res.locals.user = req.user;
            next();
        });
        this.app.use((req: any, res: any, next) => {
            // After successful login, redirect back to the intended page
            if (!req.user
                && req.path !== '/login'
                && req.path !== '/signup'
                && !req.path.match(/^\/auth/)
                && !req.path.match(/\./)) {
                req.session.returnTo = req.originalUrl;
            } else if (req.user
                && (req.path === '/account' || req.path.match(/^\/api/))) {
                req.session.returnTo = req.originalUrl;
            }
            next();
        });
        this.app.use('/', express.static(path.join(__dirname, 'public'), { maxAge: 31557600000 }));
        this.app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/popper.js/dist/umd'), { maxAge: 31557600000 }));
        this.app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/bootstrap/dist/js'), { maxAge: 31557600000 }));
        this.app.use('/js/lib', express.static(path.join(__dirname, 'node_modules/jquery/dist'), { maxAge: 31557600000 }));
        this.app.use('/webfonts', express.static(path.join(__dirname, 'node_modules/@fortawesome/fontawesome-free/webfonts'), { maxAge: 31557600000 }));


        Routes.initialize(this.app, passport, PassportConfig);


        /**
        * Error Handler.
        */
        if (process.env.NODE_ENV === 'development') {
            // only use in development
            this.app.use(errorHandler());
        } else {
            this.app.use((err, req: any, res: any, next) => {
                console.error(err);
                res.status(500).send('Server Error');
            });
        }

    }

}

export default new App().app;