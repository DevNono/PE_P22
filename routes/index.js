'use strict';
const express = require('express');
const fs = require('fs');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', {title: 'Express'});
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
