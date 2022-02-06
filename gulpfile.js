const gulp = require('gulp');
const nodemon = require('gulp-nodemon');
const browserSync = require('browser-sync').create();
require('dotenv').config();

gulp.task('gulp_nodemon', () => {
	nodemon({
		script: 'server.js', // This is where my express server is
		ext: 'js mjs twig json', // Nodemon watches *.js, *.html and *.css files
	});
});

gulp.task('sync', () => {
	browserSync.init({
		port: 3000, // This can be any port, it will show our app
		proxy: `http://localhost:${process.env.APP_PORT}/`, // This is the port where express server works
		ui: {port: 3000}, // UI, can be any port
		reloadDelay: 1000, // Important, otherwise syncing will not work
	});
	gulp.watch(['./**/*.js', './**/*.twig', './**/*.css']).on('change', browserSync.reload);
});

exports.build = gulp.parallel(['gulp_nodemon', 'sync']);
