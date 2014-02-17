var gulp   = require( 'gulp' ),
    gutils = require( 'gulp-util' ),
    mocha  = require( 'gulp-mocha' );

gulp.task('test', function() {
    return gulp.src(['test/*-test.js'], { read: false })
               .pipe(mocha({
                   reporter: 'spec'
               }));
});
