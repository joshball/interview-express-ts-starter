import { NextFunction, Request, Response, Router } from 'express';
export const UsersController: Router = Router();

UsersController.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        res.status(200).send({ data: 'Pong!' });
    } catch (e) {
        next(e);
    }
});
