'use strict';

const fs = require('fs');
const path = require('path');
const Sequelize = require('sequelize');
const basename = path.basename(__filename);
const db = {};

const sequelize = new Sequelize(process.env.MYSQL_DATABASE, process.env.MYSQL_USER, process.env.MYSQL_PASSWORD, {
	host: process.env.MYSQL_HOST,
	port: 3306,
	dialect: 'mysql',
});

async function testConnectionToDB() {
	try {
		await sequelize.authenticate();
		console.log('Database connected successfully.');
	} catch (error) {
		console.error('Unable to connect to the database:', error);
	}
}

// testConnectionToDB();

// Models parsing
// fs
// 	.readdirSync(path.join(__dirname, '/models'))
// 	.filter(file => (file.indexOf('.') !== 0) && (file !== basename) && (file.slice(-3) === '.js'))
// 	.forEach(file => {
// 		const model = require(path.join(__dirname, file))(sequelize, Sequelize.DataTypes);
// 		db[model.name] = model;
// 	});

// Object.keys(db).forEach(modelName => {
// 	if (db[modelName].associate) {
// 		db[modelName].associate(db);
// 	}
// });

db.sequelize = sequelize;
db.Sequelize = Sequelize;

module.exports = db;
