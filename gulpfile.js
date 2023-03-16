import gulp from 'gulp';
import babel from 'gulp-babel';
import uglify from 'gulp-uglify';
import less from 'gulp-less';
import cleanCSS from 'gulp-clean-css'
const { src, dest} = gulp;

function styles() {
    return src('public/*.less')
    .pipe(less()) // Обработать LESS
    .pipe(cleanCSS()) // Минификация CSS
    .pipe(dest('build-gulp/public'));
}

function scripts() {
	return src('public/*.js')
		.pipe(babel({ presets: ['@babel/env'] }))
		.pipe(uglify())
		.pipe(dest('build-gulp/public'));
};

const build = gulp.series(styles, scripts);

export default build;