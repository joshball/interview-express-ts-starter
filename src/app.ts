import express, { Application } from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import { routes } from './routes';

// Boot express
export const app: Application = express();

app.use(cors());

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

// Application routing
routes(app);
