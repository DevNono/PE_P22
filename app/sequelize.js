const dotenv = require('dotenv').config();

console.log({
	development: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
	test: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
	production: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
});

module.exports = {
	development: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
	test: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
	production: {
		username: process.env.MYSQLUSER,
		password: process.env.MYSQLPASSWORD,
		database: process.env.MYSQLDATABASE,
		host: process.env.MYSQLHOST,
		port: process.env.MYSQLPORT,
		dialect: 'mysql',
	},
};
