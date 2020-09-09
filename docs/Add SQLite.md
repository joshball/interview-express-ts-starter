# SQLite3 

## Install

    $ yarn add sqlite3 sequelize

    $ yarn add -D @types/sqlite3

## Docs

    https://github.com/mapbox/node-sqlite3/wiki/API
    https://sequelize.org/master/
    
    Node.js ORM for Postgres, MySQL, MariaDB, SQLite and Microsoft SQL Server. 


    CREATE TABLE todo(
        task text
    );

    CREATE TABLE done(
        task text
    );

## Usage 


    var sqlite3 = require('sqlite3').verbose();
    var db = new sqlite3.Database(':memory:');
    
    db.serialize(function() {
        db.run("CREATE TABLE lorem (info TEXT)");
        
        var stmt = db.prepare("INSERT INTO lorem VALUES (?)");
        for (var i = 0; i < 10; i++) {
            stmt.run("Ipsum " + i);
        }
        stmt.finalize();
        
        db.each("SELECT rowid AS id, info FROM lorem", function(err, row) {
            console.log(row.id + ": " + row.info);
        });
    });
    
    
    db.close();

## Module:
     getTodoList: function(callback:any){
        db.all("SELECT * FROM todo", function(err:any, res:any){
        callback(res);
        });
    },

    const { Sequelize, Model, DataTypes } = require('sequelize');
    const sequelize = new Sequelize('sqlite::memory:');

    class User extends Model {}
    User.init({
    username: DataTypes.STRING,
    birthday: DataTypes.DATE
    }, { sequelize, modelName: 'user' });

    (async () => {
    await sequelize.sync();
    const jane = await User.create({
        username: 'janedoe',
        birthday: new Date(1980, 6, 20)
    });
    console.log(jane.toJSON());
    })();