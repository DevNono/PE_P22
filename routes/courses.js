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
	const sections = [];
	for (let i = 0; i < fs.readdirSync(path.join(__dirname, '../resources/courses')).length - 1; i++) {
		const section = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/courses/section${i + 1}/section.json`)));
		section.id = i + 1;
		section.modules = [];
		for (let j = 1; j < fs.readdirSync(path.join(__dirname, `../resources/courses/section${i + 1}`)).length; j++) {
			const module = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/courses/section${i + 1}/module${j}.json`)));
			module.id = j;
			section.modules.push(module);
		}

		sections.push(section);
	}

	res.render('courses', {title: 'Courses', sections});
});

router.get('/:id/:id2', (req, res) => {
	const {id} = req.params;
	const {id2} = req.params;

	const section = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/courses/section${id}/section.json`)));
	section.id = id;

	// Load a json file in the resources folder and extract in a variable using fs
	const module = JSON.parse(fs.readFileSync(path.join(__dirname, `../resources/courses/section${id}/module${id2}.json`)));
	module.id = id2;
	for (let i = 0; i < module.content.length; i++) {
		if (module.content[i].type === 'code') {
			module.content[i].code = escapeHtml(module.content[i].code);
		}
	}

	if ((fs.readdirSync(path.join(__dirname, `../resources/courses/section${id}`)).length - 1) === parseInt(id2, 10)) {
		if ((fs.readdirSync(path.join(__dirname, '../resources/courses')).length - 1) > parseInt(id, 10)) {
			section.next = parseInt(id, 10) + 1;
			module.next = 1;
		} else {
			section.next = null;
			module.next = null;
		}
	} else {
		section.next = parseInt(id, 10);
		module.next = parseInt(id2, 10) + 1;
	}

	// TODO: shuffle gap fill words before send to page
	res.render('course', {title: 'Course', section, module});
});

module.exports = router;
