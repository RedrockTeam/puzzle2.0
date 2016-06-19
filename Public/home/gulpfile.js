

	// 引入 gulp
	var gulp = require('gulp');

	// 引入组件
	var sass = require('gulp-sass');
	var cache = require('gulp-cache');
	var concat = require('gulp-concat');
	var jshint = require('gulp-jshint');
	var uglify = require('gulp-uglify');
	var rename = require('gulp-rename');
	var plumber = require('gulp-plumber');
	var cssmin = require('gulp-minify-css');
	var imagemin = require('gulp-imagemin');
	var pngquant = require('imagemin-pngquant');
	var browserSync = require('browser-sync').create();


	gulp.task('imagemin', function () {
	    gulp.src('./src/images/*.{png, jpg, gif, ico}')
	        .pipe(cache(imagemin({
	            optimizationLevel: 1, //类型：Number  默认：3  取值范围：0-7（优化等级）
	            progressive: true, //类型：Boolean 默认：false 无损压缩jpg图片
	            interlaced: true, //类型：Boolean 默认：false 隔行扫描gif进行渲染
	            use: [pngquant({quality: '65-80'})]
	        })))
	        .pipe(gulp.dest('./build/images'));
	});

	gulp.task('uglify', function() {
	    gulp.src('./src/js/*.js')
	        .pipe(uglify())
	        .pipe(gulp.dest('./build/js'));
	});

	gulp.task('sass', function() {
	    gulp.src('./src/scss/*.scss')
	        .pipe(plumber())
	        .pipe(sass())
	        .pipe(gulp.dest('./build/css'))
	        .pipe(browserSync.reload({stream: true}));
	});


	gulp.task('styles', function() {
	    gulp.src('./src/css/index.css')
	        .pipe(concat('index.min.css'))
	        .pipe(cssmin())
	        .pipe(gulp.dest('./src/css'));
	});



	// 服务器
	gulp.task('server', function() {
	    browserSync.init({
	        proxy: "localhost:80"
	    });
	    // sass编译
	    gulp.watch("./src/scss/*.scss", ['sass']);
        // 图片压缩
        gulp.watch('./src/images/*.{png, jpg, gif, ico}', ['imagemin']);
		// js压缩
		// gulp.watch('./src/js/*.js', ['uglify']);
	    // 页面监听
	    gulp.watch("index.html").on('change', browserSync.reload);
	});

	// 默认任务

	gulp.task('default', ['server']);
