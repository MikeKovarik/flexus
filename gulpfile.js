'use strict'

var gulp = require('gulp')
var plumber = require('gulp-plumber')
var notify = require('gulp-notify')
var changed = require('gulp-changed')
var less = require('gulp-less')
var rename = require('gulp-rename')
var sourcemaps = require('gulp-sourcemaps')
var rollupBabel = require('rollup-plugin-babel')
var rollup = require('gulp-better-rollup')
var pkg = require('./package.json')

function watch(watchGlob, source, callback, globOptions) {
	if (source === undefined) {
		source = watchGlob
	}
	if (typeof source === 'function') {
		callback = source
		source = watchGlob
	}
	var cwd = process.cwd()
	gulp.watch(watchGlob, globOptions)
		.on('change', e => {
			if (source)
				callback(gulp.src(source, globOptions))
			else
				callback(gulp.src(path.relative(cwd, e.path), globOptions))
		})
	// TODO: if this is wildcard, make this return everything
	return callback(gulp.src(source, globOptions))
}



var port = 8080

var DEST = {
	css: 'css',
	lib: 'lib',
	polyfills: 'polyfills',
	elements: 'elements'
}

var rollupOptions = {
	treeshake: false,
	plugins: [rollupBabel()],
	external: ['ganymede', 'flexus'],
	globals: {
		ganymede: 'ganymede',
		flexus: 'flexus',
	},
	onwarn(warning) {
		// skip certain warnings
		if (warning.code === 'UNUSED_EXTERNAL_IMPORT') return
		// console.warn everything else
		console.warn(warning.message)
	}
}

gulp.task('flexus', () => {
	return watch('src/lib/flexus/*.js', 'src/lib/flexus/flexus.js', stream => stream
		.pipe(plumber(notify.onError('flexus: <%= error.message %>')))
		.pipe(sourcemaps.init())
		.pipe(rollup(rollupOptions, 'umd'))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(DEST.lib))
	)
})

gulp.task('ganymede', () => {
	return watch('src/lib/ganymede/*.js', 'src/lib/ganymede/ganymede.js', stream => stream
		.pipe(plumber(notify.onError('ganymede: <%= error.message %>')))
		.pipe(sourcemaps.init())
		.pipe(rollup(rollupOptions, 'umd'))
		.pipe(sourcemaps.write(''))
		.pipe(gulp.dest(DEST.lib))
	)
})

gulp.task('polyfills', () => {
	return watch('src/polyfills/*.js', stream => stream
		.pipe(plumber(notify.onError('polyfills: <%= error.message %>')))
		//.pipe(sourcemaps.init())
		.pipe(rollup(Object.assign({
			moduleId: '',
			moduleName: '',
		}, rollupOptions), 'umd'))
		//.pipe(sourcemaps.write())
		.pipe(gulp.dest(DEST.polyfills))
	)
})

gulp.task('elements', () => {
	return watch('src/elements/*.js', stream => stream
		.pipe(plumber(notify.onError('elements: <%= error.message %>')))
		.pipe(sourcemaps.init())
		.pipe(rollup(rollupOptions, 'umd'))
		.pipe(sourcemaps.write())
		.pipe(gulp.dest(DEST.elements))
	)
})




var lessConfig = {strictMath: true}

function buildLess(watchNames, inputName, renameTo) {
	return watch(watchNames, inputName, stream => {
		return stream
			.pipe(plumber(notify.onError('<%= error.message %>')))
			.pipe(sourcemaps.init())
			.pipe(less(lessConfig))
			.pipe(renameTo ? rename({basename: renameTo}) : rename({prefix: 'flexus-'}))
			.pipe(sourcemaps.write(''))
			.pipe(gulp.dest(DEST.css))
			//.pipe(browser.reload({stream: true}))
	}, {cwd: 'src/css/'})
}

gulp.task('ui-neon',    () => buildLess(['*.less', '!material*.less'], 'neon.less'))
gulp.task('ui-material', () => buildLess(['*.less', '!neon*.less'], 'material.less'))

gulp.task('ui', ['ui-neon', 'ui-material'])

gulp.task('icons-neon',     () => buildLess('neon-iconpack.less'    , undefined, 'flexus-neon-icons'))
gulp.task('icons-material', () => buildLess('material-iconpack.less', undefined, 'flexus-material-icons'))
//gulp.task('icons-neon',     () => buildLess('neon-iconpack.less')    )
//gulp.task('icons-material', () => buildLess('material-iconpack.less'))

gulp.task('icons', ['icons-neon', 'icons-material'])




gulp.task('core', ['ui', 'elements'])
gulp.task('libs', ['ganymede', 'flexus', 'polyfills'])
gulp.task('default', ['libs', 'core'])

