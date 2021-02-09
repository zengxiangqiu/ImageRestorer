const env = require('./env.js');
 
const Sequelize = require('sequelize');

const sequelize = new Sequelize(env.database, env.username, env.password, {
  host: env.host,
  dialect: env.dialect,
  operatorsAliases: false,
  dialectOptions: {
    encrypt: true
  },
  logging: console.log
});

sequelize
.authenticate()
.then(() => {
  console.log('Connection has been established successfully.');
})
.catch(err => {
  console.error('Unable to connect to the database:', err);
});


const db = {};
 
db.Sequelize = Sequelize;
db.sequelize = sequelize;

db.images = require('../model/img.model.js')(sequelize, Sequelize);

module.exports = db;