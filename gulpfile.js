import del from 'del';
import gulp from 'gulp';
import pipeIf from "gulp-if";
import pug from "gulp-pug";
import plumberNotifier from "gulp-plumber-notifier";
import htmlReplace from 'gulp-html-replace';
import imagemin from 'gulp-imagemin';
import spritesmith from "gulp.spritesmith";
import buffer from "vinyl-buffer";
import newer from "gulp-newer";
import stylus from "gulp-stylus";
import gcmq from "gulp-group-css-media-queries";
import rename from "gulp-rename";
import cssnano from 'gulp-cssnano';
import autoprefixer from "gulp-autoprefixer";
import uncss from "gulp-uncss-sp";
import glob from "glob";
import babel from "gulp-babel";
import uglify from "gulp-uglify";
import webpack from 'webpack-stream';
import browserSync from "browser-sync";
const env              = process.env.NODE_ENV;
// breakpoint ипользуются stylus и pug
// pug -> module picture
// stylus -> mixin imageSet, @media
const breakpoint = {
	sizeSmall: "480px",
	sizeMedium: "800px",
	sizeLarge: "991px",
	sizeExtraLarge: "1170px",
	sizeHD: "1440px"
};

async function moveFont() {
	return gulp.src([
			'dev/lib/fonts/*',
		])
		.pipe(newer('build/fonts'))
		.pipe(gulp.dest('build/fonts'));
}

async function moveJs() {
	return gulp.src([
			'dev/lib/js/*.js',
			'./node_modules/@babel/polyfill/dist/polyfill.min.js',
			'./node_modules/swiper/swiper-bundle.min.js'
		])
		.pipe(newer('build/js'))
		.pipe(gulp.dest('build/js'));
}

async function moveCss() {
	return gulp.src([
		'./dev/lib/css/*.css',
		'./node_modules/swiper/swiper-bundle.min.css'
	])
	.pipe(newer('build/css'))
	.pipe(gulp.dest('build/css'));
}

function sync() {
	return browserSync({
		server: {
			baseDir: 'build'
		},
		notify: false
	});
}

function pugToHtml() {
	return gulp.src(['dev/pug/**/*.pug', '!dev/pug/**/layout.pug', '!dev/pug/**/_*.pug'])
		.pipe(plumberNotifier())
		.pipe(pug({ pretty: true, locals: breakpoint }))
		.pipe(pipeIf(env === 'production', htmlReplace({
			css: '/css/main.min.css',
			js_bottom: '/js/script.min.js'
		})))
		.pipe(gulp.dest('build'))
		.pipe(browserSync.reload({ stream: true }));
}

function img() {
	return gulp.src([
		'dev/img/**/*.*',
		'!dev/img/sprite-svg/*.*',
		'!dev/img/sprite-png/**/*.*',
		'!dev/img/icon-font/**/*.*'
	])
	.pipe(newer('build/img'))
	.pipe(pipeIf(env === 'production', imagemin()))
	.pipe(gulp.dest('build/img'));
}

function stylusToCss() {
	return gulp.src(['dev/stylus/main.styl', 'dev/stylus/print.styl'])
		.pipe(plumberNotifier())
		.pipe(stylus({ 'include css': true, rawDefine: { ...breakpoint }}))
		.pipe(pipeIf(env === 'production', uncss({
				html: glob.sync('./build/**/*.html')
		})))
		.pipe(pipeIf(env === 'production', autoprefixer({
			cascade: false,
			// grid: "autoplace" // для поддержки grid в IE11
		})))
		.pipe(pipeIf(env === 'production', gcmq()))
		.pipe(pipeIf(env === 'production', cssnano()))
		.pipe(pipeIf(env === 'production', rename({
			suffix: '.min'
		})))
		.pipe(gulp.dest('build/css'))
		.pipe(browserSync.reload({ stream: true }));
}

async function spritePng() {
	var spriteData = gulp.src('dev/img/iconpng/**/*.png').pipe(spritesmith({
				imgName: 'iconpng.png',
				cssName: '_sprite.styl',
				cssFormat: 'stylus',
				imgPath: '../img/sprite/iconpng.png',
				styleTemplate: 'dev/stylus/modules/stylus.template.mustache'
		}));
		spriteData.img
			.pipe(buffer())
			.pipe(pipeIf(env === 'production', imagemin()))
			.pipe(gulp.dest('dev/img/sprite'));
		spriteData.css
			.pipe(gulp.dest('dev/stylus/modules'));
}

function jsDev() {
	return (
		gulp
			.src("dev/js/script.js")
			.pipe(plumberNotifier())
			.pipe(
				webpack({
					mode: env,
					output: {
						filename: 'script.js',
					},
				})
			)
			.pipe(gulp.dest('build/js'))
			.pipe(browserSync.reload({ stream: true }))
	);
}

function jsBuild() {
	return (
		gulp
			.src("dev/js/script.js")
			.pipe(
				webpack({
					// entry: {
					// 	app: './dev/js/script.js',
					// 	script: './dev/js/script.js'
					// },
					mode: env,
					output: {
						filename: 'script.min.js',
					}
				})
			)
			.pipe(gulp.dest('build/js'))
			.pipe(browserSync.reload({ stream: true }))
	);
}

function watch() {
	gulp.watch('dev/pug/**/*.pug', pugToHtml);
	gulp.watch('dev/img/**/*.*', img);
	gulp.watch('dev/stylus/**/*.styl', stylusToCss);
	gulp.watch('dev/js/**/*.js', jsDev);
}

// очистка папки build
export function clear() {
	return del(['build/*']);
}

// перемещение font, js, css
export const move = gulp.parallel(moveFont, moveJs, moveCss);

// инициализация
export const init = gulp.series(
	gulp.parallel(spritePng, move),
	jsDev,
	stylusToCss,
	img,
	pugToHtml
);

// сжатие файлов (js, css), оптимизация изображений
export const build = gulp.series(
	clear,
	gulp.parallel(spritePng, move),
	jsBuild,
	img,
	pugToHtml,
	stylusToCss,
	sync
);

// разработка
const dev = gulp.parallel(
	sync,
	watch
);
export default dev;