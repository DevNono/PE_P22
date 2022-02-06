'use strict';
const express = require('express');
const router = express.Router();

/* GET home page. */
router.get('/', (req, res) => {
	res.render('index', {title: 'Express 2'});
});

module.exports = router;
