const gulp = require('gulp');
const path = require('path');
const ts = require('gulp-typescript');
const tsProject = ts.createProject('tsconfig.json');
const through = require('through2');
const fs = require('fs');
const { execSync } = require('child_process');
const del = require('del');
const config = require('config');

function build() {
    return tsProject
        .src()
        .pipe(through.obj((chunk, enc, cb) => {
            let srcFile = path.relative('./', chunk.path.split('.ts').join('.js')).split(path.sep);
            srcFile[0] = 'dist';
            let outFile = path.resolve(...srcFile);
            if (!fs.existsSync(outFile)) {
                cb(null, chunk);
            } else {
                fs.stat(chunk.path, (err1, stat1) => {
                    if (err1) console.error(err1);
                    fs.stat(outFile, (err, stat) => {
                        if (err) console.error(err);
                        if (stat1.mtimeMs > stat.mtimeMs) {
                            cb(null, chunk);
                        } else {
                            cb(null, null);
                        }
                    });
                });
            }
        }))
        .pipe(tsProject())
        .js
        .pipe(gulp.dest('dist'));
}

function runner() {
    execSync(process.env.ADVENT_CMD);
}

function watch() {
    if ('ADVENT_CMD' in process.env) {
        gulp.watch('src/**/*.ts', gulp.series(build, runner));
    } else {
        gulp.watch('src/**/*.ts', build);
    }
}

function desc() {
    let year = config.get('year');
    let session = config.get('session');
    execSync(`npx advent-cli --year ${year} --session ${session} ./desc/${year}`);
    return;
}

function cleanDesc() {
    return del('desc/**/*.txt');
}

function watchRun() {
    return gulp.watch('src/**/*.ts', gulp.series(build, () => {
        let res = execSync(process.env.ADVENT_CMD || 'npm start').toString();
        console.log(res);
    }));
}

var bd = gulp.series(build);

exports.build = build;
exports.runner = runner;
exports.watch = watch;
exports.desc = desc;
exports.cleanDesc = cleanDesc;

exports.default = bd;