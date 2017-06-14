let gulp = require('gulp');
let less = require('gulp-less'); //
let minicss = require("gulp-clean-css");
let rename = require("gulp-rename");
let browserSync = require('browser-sync').create();
let reload = browserSync.reload;


// 文件路径
let lessPath = "test/css/**/*.less"; // 需要装换less路径
let less2cssPath = "test/css"; // less装换css后存放路径
let cssPath = "test/css/**/*.css"; // 需要压缩的css路径
let css2miniPath = "test/css/min"; // 压缩后的css路径

let browserSyncPath = ["test/**/*.html", "test/**/*.js", "test/**/*.css"]; // 监视同步路径
let browserSyncWithoutCssPath = ["test/**/*.html", "test/**/*.js"]; // 监视路径不要css
let browserSyncRootPath = "./test/";
let browserSyncIndex = "test.html"; // 服务器启动的时候,默认打开的文件


/**
 * globs 采用 node-glob 语法
 *
 * ! 不匹配
 * * 任意文件
 * ** 任意文件夹
 * {} 类似正则的分组 src/{index,layout}.less 会 拆分为"src/index.less","src/layout.less" 即{index,layout}有点类似/(index)|(layout)/g
 */

gulp.task('default', ["less", "syncLess2"], function() {
    console.log("********\n执行了 less & syncLess2\n********");
});



/**
 * 转换less
 */
// 装换less封装函数
function ifFile(path) { //node fs模块也有这个方法 但是是根据文件去判断的吧 我这个是根据路径去判断
    let path_separator = path.includes("\\") ? "\\" : "/"; // 路径分隔符 windows 是"\" , linux是"/"
    let pathArr = path.split(path_separator);
    let arrLen = pathArr.length;
    if (pathArr[arrLen - 1] == "") { //因为如果是文件夹的话是以\结尾 , 那么数组的最后一个就为 ""
        return false
    }
    return true;
}

function lessFn(path, destPath) { // 只有path是event.path的时候才可以忽略destPath
    let path_separator = path.includes("\\") ? "\\" : "/"; // 路径分隔符 windows 是"\" , linux是"/"
    destPath = destPath || path.split(path_separator).slice(0, -1).join("/"); //如果path是event.path,写入文件路径就是被读取文件的当前文件夹
    return gulp.src(path)
        .pipe(less())
        .pipe(gulp.dest(destPath)); // 返回流,调用后在返回值后面再流的操作
}
// 转换全部less
gulp.task("less", function() {
    lessFn(lessPath, less2cssPath)
});

// 自动编译less
gulp.task("autoLess", function() {
    gulp.watch(lessPath, ['less']) // 后面的任务不要是监视任务,是一次性任务(任务里面没有watch),否则就会出现好多重监视
});

// 这个是只会去转换修改的那个文件 , 而不会转换全部less , 减少性能消耗. 考拉就是单个装换
gulp.task("autoOneLess", function() {
    gulp.watch(lessPath).on('change', function(event) {
        if (ifFile(event.path)) {
            lessFn(event.path,less2cssPath);
        } else {
            console.log("***************************没有执行lessFn,因为是个文件夹")
        }
    });
});



/**
 * 压缩css
 */
// minicss
gulp.task("minicss", function() {
    gulp.src(cssPath)
        .pipe(minicss())
        .pipe(rename({ suffix: '.min' }))
        .pipe(gulp.dest(css2miniPath));
});

// less & minicss
gulp.task("lessmini", function() {
    lessFn(path, destPath)
        .pipe(minicss())
        .pipe(rename({ suffix: '.min' })) //重命名
        .pipe(gulp.dest(css2miniPath));
});



/**
 * browser-sync
 */
// 静态服务器
gulp.task('server', function() {
    browserSync.init({
        server: browserSyncRootPath
    });
});

// 浏览器同步
gulp.task('browser-sync', function() {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });
    gulp.watch(browserSyncPath).on("change", function(event) {
        gulp.src(event.path).pipe(browserSync.reload({ stream: true }));
    });
});



/**
 * 浏览器同步 同时 转换less
 */
// 方式1 实际监视的是css , 只是less转换的时候触发css变化(可能不能用全部转换方法,只能用哪个less变化就装换哪个)
gulp.task('syncLess', function() {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });

    // 转换less
    gulp.watch(lessPath).on('change', function(event) {
        if (ifFile(event.path)) {
            lessFn(event.path,less2cssPath);
        } else {
            console.log("***************************没有执行lessFn,因为是个文件夹")
        }
    });
    // 监视文件变化同步浏览器
    gulp.watch(browserSyncPath).on("change", function(event) {
        gulp.src(event.path).pipe(browserSync.reload({ stream: true }));
    });
});

// 方式2 监视的是less , 转换后 reload
function synclessFn(path,destPath) {
    lessFn(path,destPath).pipe(browserSync.reload({ stream: true }));
}
gulp.task('syncLess2', function() {
    browserSync.init({
        server: {
            baseDir: browserSyncRootPath,
            index: browserSyncIndex
        }
    });
    // 转换less 并刷新
    gulp.watch(lessPath).on('change', function(event) {
        if (ifFile(event.path)) {
            console.log(lessPath,event.path,less2cssPath);
            synclessFn(event.path,less2cssPath);
        } else {
            console.log("***************************没有执行synclessFn,因为是个文件夹")
        }
    });
    // 监视文件变化同步浏览器
    gulp.watch(browserSyncWithoutCssPath).on("change", function(event) {
        gulp.src(event.path).pipe(browserSync.reload({ stream: true }));
    });
});