'use strict';
const express = require('express');
const fs = require('fs');
const router = express.Router();
const bcrypt = require('bcrypt');

const {User} = require('../database/models');

const MailazyClient = require('mailazy-node');
const client = new MailazyClient({accessKey: '', accessSecret: ''});

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', {title: 'Express'});
});

router.post('/contact', async (req, res) => {
	const {name, email, message} = req.body;
	try {
		const resp = await client.send({
			to: process.env.EMAIL_ADDRESS, // Required
			from: email, // Use domain you verified, required
			subject: '', // Required
			text: message,
			html: message,
		});
		console.log('resp: ' + resp);
	} catch (e) {
		console.log('er ror: ' + e);
	}
});

/* Register Route
========================================================= */
router.get('/register', (req, res) => {
	res.render('register', {title: 'Register'});
});

router.post('/register', async (req, res) => {
	// Hash the password provided by the user with bcrypt so that
	// we are never storing plain text passwords. This is crucial
	// for keeping your db clean of sensitive data
	const hash = bcrypt.hashSync(req.body.password, 10);

	try {
		// Create a new user with the password hash from bcrypt
		const user = await User.create(Object.assign(req.body, {password: hash}));

		// Data will be an object with the user and it's authToken
		const data = await user.authorize();

		// Send back the new user and auth token to the
		// client { user, authToken }
		return res.json(data);
	} catch (err) {
		return res.status(400).send(err);
	}
});

/* Login Route
  ========================================================= */

router.get('/login', (req, res) => {
	res.render('login', {title: 'Login'});
});

router.post('/login', async (req, res) => {
	const {userName, password} = req.body;

	// If the username / password is missing, we use status code 400
	// indicating a bad request was made and send back a message
	if (!userName || !password) {
		return res.status(400).send('Missing username or password');
	}

	try {
		const user = await User.authenticate(userName, password);

		return res.json(user);
	} catch (err) {
		return res.status(400).send('invalid username or password');
	}
});

/* Logout Route
  ========================================================= */
router.get('/logout', async (req, res) => {
	// Because the logout request needs to be send with
	// authorization we should have access to the user
	// on the req object, so we will try to find it and
	// call the model method logout
	const {user, cookies: {auth_token: authToken}} = req;

	// We only want to attempt a logout if the user is
	// present in the req object, meaning it already
	// passed the authentication middleware. There is no reason
	// the authToken should be missing at this point, check anyway
	if (user && authToken) {
		await req.user.logout(authToken);
		return res.status(204).send();
	}

	// If the user missing, the user is not logged in, hence we
	// use status code 400 indicating a bad request was made
	// and send back a message
	return res.status(400).send({errors: [{message: 'not authenticated'}]});
});

/* Me Route - get the currently logged in user
  ========================================================= */
router.get('/me', (req, res) => {
	if (req.user) {
		return res.send(req.user);
	}

	res.status(404).send({errors: [{message: 'missing auth token'}]});
});

router.get('/health', (req, res) => {
	res.send('OK');
});

router.get('/game', (req, res) => {
	fs.readFile(__dirname + '/../card_game/index.html', 'utf8', (err, text) => {
		res.send(text);
	});
});

module.exports = router;
