// node.js Packages / Dependencies
const gulp = require('gulp');
const sass = require('gulp-sass');
const uglify = require('gulp-uglify');
const rename = require('gulp-rename');
const concat = require('gulp-concat');
const cleanCSS = require('gulp-clean-css');
const imageMin = require('gulp-imagemin');
const pngQuint = require('imagemin-pngquant');
const browserSync = require('browser-sync').create();
const gulpautoprefixer = require('gulp-autoprefixer');
const jpgRecompress = require('imagemin-jpeg-recompress');

const mode = require('gulp-mode')(); //last '()' means a function must be needed or get err
const inject = require('gulp-inject');
const postcss = require('gulp-postcss');
const autoprefixer = require('autoprefixer');
const purgecss = require("@fullhuman/postcss-purgecss");
const tailwindcss = require("tailwindcss");
// const series = require("stream-series");
const atimport = require("postcss-import");
const del = require("del");
const replace = require('gulp-replace');

// Paths
var paths = {
  root: {
    www: './src'
  },
  vendors: {
    css: ['node_modules/uikit/dist/css/uikit.min.css'],
    // js: ['node_modules/uikit/dist/js/uikit.min.js', 'node_modules/uikit/dist/js/uikit-icons.min.js'],
    js: ['node_modules/uikit/dist/js/uikit.min.js', 'node_modules/uikit/dist/js/uikit-icons.min.js', 'node_modules/FitText-UMD/fittext.js'], //FitText
    fontawesome: ['node_modules/@fortawesome/fontawesome-free/css/all.min.css'],
    fonts: 'node_modules/@fortawesome/fontawesome-free/webfonts/*',
  },
  // template: '',
  src: {
    root: './src/',
    html: 'src/*.html',
    css: 'src/css/*.css',
    js: 'src/js/*.js',
    vendors: 'src/libs/**/*.*',
    img: 'src/img/**/*.+(png|jpg|gif|svg)',
    scss: 'src/scss/*.scss'
  },
  dist: {
    root: './dist/',
    css: 'css',
    js: 'js',
    img: 'img',
    font: 'webfonts',
    vendors: 'libs'
  }
}

// Output tailwind css
gulp.task('tailwind', function() {
  return gulp.src('tailwind.css')
    .pipe(mode.development(
      postcss([
        atimport(),
        tailwindcss("tailwind.config.js"),
        autoprefixer()
      ])
    ))
    .pipe(mode.production(
      postcss([
        atimport(),
        tailwindcss("tailwind.config.js"),
        purgecss({
          content: [paths.src.html, paths.src.js],
          // whitelist: ['opacity-100'],
          defaultExtractor: content =>
            content.match(/[\w-/:!@]+(?<!:)/g) || []
        }),
        autoprefixer()
      ])
    ))
    //Minify css
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(mode.development(gulp.dest(paths.src.root + paths.dist.vendors)))
    .pipe(mode.production(gulp.dest(paths.dist.root + paths.dist.vendors)))
  // .pipe(gulp.dest(paths.src.root + paths.dist.vendors))
  // .pipe(gulp.dest(paths.dist.root + paths.dist.vendors))
});

// copy vendors files to src & dist
gulp.task('copyjs', function() {
  return gulp.src(paths.vendors.js)
    .pipe(gulp.dest(paths.src.root + paths.dist.vendors))
    .pipe(gulp.dest(paths.dist.root + paths.dist.vendors))
  // .pipe(mode.production(gulp.dest(paths.dist.vendors)))
});
gulp.task('copycss', function() {
  return gulp.src(paths.vendors.css)
    .pipe(gulp.dest(paths.src.root + paths.dist.vendors))
    .pipe(gulp.dest(paths.dist.root + paths.dist.vendors))
  // .pipe(gulp.dest(paths.dist.root + paths.dist.css))
});
gulp.task('fontawesome', function() {
  return gulp.src(paths.vendors.fontawesome)
    .pipe(rename("fontawesome.min.css"))
    .pipe(gulp.dest(paths.src.root + paths.dist.vendors))
    .pipe(gulp.dest(paths.dist.root + paths.dist.vendors))
  // .pipe(gulp.dest(paths.dist.root + paths.dist.css))
});
gulp.task('copyfonts', function() {
  return gulp.src(paths.vendors.fonts)
    .pipe(gulp.dest(paths.src.root + paths.dist.font))
    .pipe(gulp.dest(paths.dist.root + paths.dist.font))
});

// inject css & js to html - https://www.npmjs.com/package/gulp-inject#method-2-use-gulp-inject-s-name-option
gulp.task('inject', function() {
  return gulp.src(paths.src.html)
    .pipe(inject(gulp.src(paths.src.vendors, {
      read: false
    }), {
      name: 'head',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.vendors + '/uikit*.css'], {
      read: false
    }), {
      name: 'uk',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.vendors + '/tailwind*.css'], {
      read: false
    }), {
      name: 'tw',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.vendors + '/font*.css'], {
      read: false
    }), {
      name: 'fa',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/main.css'], {
      read: false
    }), {
      name: 'style1',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/colors.css'], {
      read: false
    }), {
      name: 'style2',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/style.css'], {
      read: false
    }), {
      name: 'style3',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.root + paths.dist.css + '/style-*.css'], {
      read: false
    }), {
      name: 'style4',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.src.js], {
      read: false
    }), {
      relative: true
    }))
    .pipe(gulp.dest(paths.src.root))
  // .pipe(gulp.dest(paths.dist.root))
});

gulp.task('build-inject', function() {
  return gulp.src(paths.src.html)
    .pipe(inject(gulp.src(paths.dist.root + paths.dist.vendors + '/*', {
      read: false
    }), {
      name: 'head',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.vendors + '/uikit*.css'], {
      read: false
    }), {
      name: 'uk',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.vendors + '/tailwind*.css'], {
      read: false
    }), {
      name: 'tw',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.vendors + '/font*.css'], {
      read: false
    }), {
      name: 'fa',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/main*.css'], {
      read: false
    }), {
      name: 'style1',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/colors*.css'], {
      read: false
    }), {
      name: 'style2',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/style.*.css'], {
      read: false
    }), {
      name: 'style3',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.css + '/style-*.css'], {
      read: false
    }), {
      name: 'style4',
      relative: true
    }))
    .pipe(inject(gulp.src([paths.dist.root + paths.dist.js + '/*.js'], {
      read: false
    }), {
      relative: true
    }))
    .pipe(gulp.dest(paths.dist.root))
});


// Compile SCSS
gulp.task('sass', function() {
  return gulp.src(paths.src.scss)
    .pipe(sass({
      outputStyle: 'expanded'
    }).on('error', sass.logError))
    .pipe(gulpautoprefixer()) //Cannot use autoprefixer or get err
    .pipe(replace('@charset "UTF-8";', ''))
    .pipe(gulp.dest(paths.src.root + paths.dist.css))
    .pipe(browserSync.stream())
});

// Minify + Combine CSS
gulp.task('css', function() {
  return gulp.src(paths.src.css)
    .pipe(
      postcss([
        atimport(),
        purgecss({
          content: [paths.src.html, paths.src.js],
          // whitelist: ['opacity-100'],
          defaultExtractor: content =>
            content.match(/[\w-/:!@]+(?<!:)/g) || []
        }),
        autoprefixer()
      ])
    )
    .pipe(cleanCSS({
      compatibility: 'ie8'
    }))
    // .pipe(concat('app.css'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.dist.root + paths.dist.css))
});

// Minify + Combine JS
gulp.task('js', function() {
  return gulp.src(paths.src.js)
    .pipe(uglify())
    // .pipe(concat('app.js'))
    .pipe(rename({
      suffix: '.min'
    }))
    .pipe(gulp.dest(paths.dist.root + 'js'))
    .pipe(browserSync.stream());
});

// Compress (JPEG, PNG, GIF, SVG, JPG)
gulp.task('img', function() {
  return gulp.src(paths.src.img)
    .pipe(imageMin([
      imageMin.gifsicle(),
      imageMin.jpegtran(),
      imageMin.optipng(),
      imageMin.svgo(),
      pngQuint(),
      jpgRecompress()
    ]))
    .pipe(gulp.dest(paths.dist.root + paths.dist.img));
});

// ceate dist dir
gulp.task('dist', function() {
  return gulp.src('*.*', {
      read: false
    }) //only empty directory without default package files
    .pipe(gulp.dest(paths.dist.root))
});

// clean dist
gulp.task('clean', function() {
  return del(['dist/**', '!dist']);
});

// Watch (SASS, CSS, JS, and HTML) reload browser on change
gulp.task('watch', function() {
  browserSync.init({
    server: {
      baseDir: paths.root.www
    }
  })
  gulp.watch(paths.src.scss, gulp.series('sass'));
  gulp.watch(paths.src.css, gulp.series('css'));
  gulp.watch(paths.src.js, gulp.series('js'));
  gulp.watch(paths.src.html).on('change', browserSync.reload);
});

//------------------- First run 'gulp vendors' ---------------------------------------------------------
//First Preset all files
gulp.task('vendors', gulp.series('tailwind', 'copyjs', 'copycss', 'fontawesome', 'copyfonts'));

//Compile SCSS to CSS and purge & minify css, needed when modify scss
gulp.task('scss', gulp.series('sass', 'css'));

//Inject path to all html files relative to /src and /dist [NO for different injection in html]
gulp.task('html', gulp.series('inject', 'build-inject'));

//0. Preset
gulp.task('start', gulp.series('vendors', 'scss', 'html'));

//1. Preset then watch
gulp.task('server', gulp.series('vendors', 'scss', 'html', 'watch'));

//2. Prepare all assets for production
gulp.task('build', gulp.series('vendors', 'scss', 'js', 'img'));
gulp.task('build-html', gulp.series('dist', 'clean', 'vendors', 'scss', 'js', 'img', 'html'));