'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', {title: 'Express 2'});
});

router.get('/health', (req, res) => {
	res.send('OK');
});

module.exports = router;
