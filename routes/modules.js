'use strict';
const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

/* GET home page. */
router.get('/', (req, res) => {
	res.render('modules', {title: 'Modules'});
});

router.get('/:id/:id2', (req, res) => {
	const {id} = req.params;
	const {id2} = req.params;
	// Load a json file in the ressources folder and extract in a variable using fs
	const json = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/modules/section${id}/module${id2}.json`)));
	res.render('module', {title: 'Module', json});
});

module.exports = router;
