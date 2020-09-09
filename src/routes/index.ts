import { Application, Router } from 'express';
import { IndexController } from '../controllers/IndexController';
import { PingController } from '../controllers/PingController';
import { ProductsController } from '../controllers/ProductsController';

const _routes: [string, Router][] = [
    ['/', IndexController],
    ['/ping', PingController],
    ['/products', ProductsController],
];

export const routes = (app: Application) => {
    _routes.forEach((route) => {
        const [url, controller] = route;
        app.use(url, controller);
    });
};
