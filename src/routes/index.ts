import { Application, Router } from 'express';
import { TinyUrlController } from '../controllers/TinyUrlController';
import { UsersController } from '../controllers/UsersController';
import { ProductsController } from '../controllers/ProductsController';

const _routes: [string, Router][] = [
    ['/', TinyUrlController],
    ['/users', UsersController],
    ['/products', ProductsController],
];

export const routes = (app: Application) => {
    _routes.forEach((route) => {
        const [url, controller] = route;
        app.use(url, controller);
    });
};
