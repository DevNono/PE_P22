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

	const section = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/modules/section${id}/section.json`)));
	section.id = id;
	// Load a json file in the resources folder and extract in a variable using fs
	const module = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/modules/section${id}/module${id2}.json`)));
	module.id = id2;
	res.render('module', {title: 'Module', section, module});
});

module.exports = router;
