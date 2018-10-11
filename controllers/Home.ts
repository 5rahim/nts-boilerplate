import {Router, Request, Response, NextFunction} from 'express';

export class HomeController {

    router: Router;

    constructor() {
        this.router = Router();
        this.routes;
    }

    public routes() {

        // Home page
        this.router.get('/', async (req: any, res, next) => {

            res.render('home', {title: 'Bienvenue'});

        });

    }

}

const HomeRoutes = new HomeController();
HomeRoutes.routes();

export default HomeRoutes.router;
