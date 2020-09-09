import config from 'config';
import mongoose from 'mongoose';
mongoose.Promise = global.Promise;
mongoose.connect((config as any).MongoDB, { useUnifiedTopology: true, useNewUrlParser: true, useCreateIndex: true });

const db = mongoose.connection;

db.on('error', console.error.bind(console, 'MongoDB connection error'));
