'use strict';
const express = require('express');
const router = express.Router();

const fs = require('fs');
const path = require('path');

function escapeHtml(unsafe) {
	return unsafe
		.replace(/&/g, '&amp;')
		.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/"/g, '&quot;')
		.replace(/'/g, '&#039;');
}

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
	for (let i = 0; i < module.content.length; i++) {
		if (module.content[i].type === 'code') {
			module.content[i].code = escapeHtml(module.content[i].code);
		}
	}

	res.render('module', {title: 'Module', section, module});
});

module.exports = router;
