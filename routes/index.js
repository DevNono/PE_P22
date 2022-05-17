'use strict';
const express = require('express');
const fs = require('fs');
const router = express.Router();

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
		console.log('errror: ' + e);
	}
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
