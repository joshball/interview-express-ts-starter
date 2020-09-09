import { NextFunction, Request, Response, Router } from 'express';
import ProductModel from '../models/ProductModel';

export const ProductsController: Router = Router();

ProductsController.get('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const products = await ProductModel.find({});
        res.status(200).json({ data: products });
    } catch (err) {
        res.json({ error: err });
        next(err);
    }
});

ProductsController.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const product = await ProductModel.findById(req.params.id);
        res.status(200).json({ data: product });
    } catch (err) {
        res.json({ error: err });
        next(err);
    }
});

ProductsController.post('/', async (req: Request, res: Response, next: NextFunction) => {
    try {
        console.log('POST new /products', req.body);
        const newProduct = {
            name: req.body.name,
            price: req.body.price,
        };
        console.log('newProduct:', newProduct);
        const Product = new ProductModel(newProduct);
        console.log('here:', Product);
        await Product.save();
        res.status(200).json({ data: Product.toJSON() });
    } catch (err) {
        res.json({ error: err });
        next(err);
    }
});

ProductsController.delete('/:id', async (req: Request, res: Response, next: NextFunction) => {
    try {
        const deleteResult = await ProductModel.findByIdAndDelete(req.params.id);
        res.status(200).json({ data: deleteResult?.toJSON() });
    } catch (err) {
        res.json({ error: err });
        next(err);
    }
});
