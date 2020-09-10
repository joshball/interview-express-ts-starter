import { JsonDB } from 'node-json-db';
import { Config } from 'node-json-db/dist/lib/JsonDBConfig';

// https://github.com/Belphemur/node-json-db

// The first argument is the database filename. If no extension, '.json' is assumed and automatically added.
// The second argument is used to tell the DB to save after each push
// If you put false, you'll have to call the save() method.
// The third argument is to ask JsonDB to save the database in an human readable format. (default false)
// The last argument is the separator. By default it's slash (/)
const dbFileName = 'tinyurls';
const saveOnPush = true;
const humanReadable = true;
const separator = '/';

export const DB = new JsonDB(new Config(dbFileName, saveOnPush, humanReadable, separator));
