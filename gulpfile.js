var config       = require('./config.js');
var PSD          = require('psd');
var mjml         = require('mjml');
var gulp         = require('gulp');
var plugins      = require('gulp-load-plugins')();
var del          = require('del');
var path         = require('path');
var urlOpen      = require('open');
var runSequence  = require('run-sequence');
var fs           = require('fs');
var argv         = require('yargs').argv;
var cheerio      = require('cheerio');
require('shelljs/global');

// MAIN

gulp.task('default', function() {
  console.log("\nAvailable actions:\n");
  console.log("   $ gulp dev                          Live development on localhost:8080");
  console.log("   $ gulp make                         Compile onto '" + config.TARGET_FOLDER + "'");
  console.log("   $ gulp make --translations          Compile and generate the translation folders");
  console.log("   $ gulp translate                    Use every language's strings.json to translate the HTML file");
  console.log("");
  console.log("   $ gulp psd                          Convert the SOURCE_PSD file into PNG");
  console.log("   $ gulp psd --file <filename.psd>    Convert <filename.psd> into PNG");
  console.log("   $ gulp pdf --file <filename.pdf>");
  console.log();
});

gulp.task('clean', function(cb) {
    return del([config.TARGET_FOLDER + '/template', config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE], cb);
});

gulp.task('dev', function(){ return runSequence('clean', 'make', 'connect', 'watch'); });

gulp.task('media:extra', ['clean'], function(){
	if (!fs.existsSync(config.TARGET_FOLDER + '/template'))
		fs.mkdirSync(config.TARGET_FOLDER + '/template');

	gulp.src(config.EXTRA_IMAGE_PATHS)
	.pipe(gulp.dest(config.TARGET_FOLDER + '/template'));
});

gulp.task('media', function(){
  // Workaround: By using translations, some images may have not finished copying/cropping
  // when the template is copied to the main language folder. This task ensures that the last
  // version of the images in the template folder are in sync with the main language content

  setTimeout(function(){
	  var prefix = config.PROJECT_PREFIX ? (config.PROJECT_PREFIX + '-') : '';

	  gulp.src(path.join(process.cwd(), 'output', 'template', prefix + "img-*.{jpg,jpeg,png,gif}"))
	    .pipe(gulp.dest(path.join(process.cwd(), 'output', config.ORIGINAL_LANGUAGE)))
	    .pipe(plugins.connect.reload());
  }, 200);
});

gulp.task('watch', function() {
  gulp.watch(path.resolve('input-contents.js'), ['make']);

  var prefix = config.PROJECT_PREFIX ? (config.PROJECT_PREFIX + '-') : '';

  gulp.watch(path.join(process.cwd(), 'output', 'template', prefix + "img-*.{jpg,jpeg,png,gif}"), ['media']);
});

gulp.task('connect', function() {
  plugins.connect.server({ root: config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE, livereload: true});
  urlOpen('http://localhost:8080/' + config.PROJECT_PREFIX + '.html');
});

gulp.task('make', ['media:extra'], function() {
	delete require.cache[path.resolve('input-contents.js')];
	var email = require(path.resolve('input-contents.js')).email;

	if(fs.existsSync(path.resolve(config.SOURCE_IMAGE)))
		console.log("Using", config.SOURCE_IMAGE, "as the main image source");

	// HTML

	var template = email.compileHTML();
	if(config.DISPLAY_TEMPLATE)
		console.log("\n------------------------------------------\nThe MJML template is:\n------------------------------------------\n" + template);

	var html = mjml.mjml2html(template);
	$ = cheerio.load(html);
	$('img').css('max-width', '100%');
	html = $.html();
	html = html.replace(/<p class="" style="font-size:1px;border-top:2px solid #000000;width:100%;"><\/p>/g, '<p class="" style="font-size:1px;border-top:2px solid #000000;width: 100%;min-width: 250px;"></p>');
	html = html.replace("<title>undefined</title>", '<title>-</title> <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />');
	fs.writeFileSync(config.TARGET_FOLDER + '/template/' + config.PROJECT_PREFIX + '.html', html);


	// TRANSLATIONS
	var json = JSON.stringify(email.getTranslationTemplate(), null, 3);
	fs.writeFileSync(config.TARGET_FOLDER + '/template/strings.json', json);

	if(argv.translations) {
		config.LANGUAGE_LIST.forEach(function(lang){
			exec('cp -a  ./output/template ./output/' + lang, function(status, output) {
			  console.log("Created ./output/" + lang);
			});
		});
	}
	else {
		exec('cp -a  ./output/template ./output/' + config.ORIGINAL_LANGUAGE, function(status, output) {

			// SHOW THE ORIGINAL TEXTS IN THE ORIGINAL LANGUAGE

			html = fs.readFileSync(config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE + '/' + config.PROJECT_PREFIX + '.html').toString();
			var strings = JSON.parse(fs.readFileSync(config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE + '/strings.json').toString());
			strings.forEach(function(obj){
				html = html.replace(obj.token, obj.original);
			});
			fs.writeFileSync(config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE + '/' + config.PROJECT_PREFIX + '.html', html);
		});
	}

	// PLAIN TEXT

	// var text = email.compileText();
	// if(config.DISPLAY_TEMPLATE)
	// 	console.log("\n------------------------------------------\nThe plain text email is:\n------------------------------------------\n" + text);

	// fs.writeFileSync(config.TARGET_FOLDER + '/template' + '/email.txt', text);

	// RELOAD

	return gulp.src(config.TARGET_FOLDER + '/' + config.ORIGINAL_LANGUAGE)
		.pipe(plugins.connect.reload());
});

gulp.task('translate', function(){
	config.LANGUAGE_LIST.forEach(function(lang){
		var html = fs.readFileSync(config.TARGET_FOLDER + '/' + lang + '/' + config.PROJECT_PREFIX + '.html').toString();
		var strings = JSON.parse(fs.readFileSync(config.TARGET_FOLDER + '/' + lang + '/strings.json').toString());

		if(lang == config.ORIGINAL_LANGUAGE) {
			strings.forEach(function(obj){
				html = html.replace(obj.token, obj.original);
			});
		}
		else {
			strings.forEach(function(obj){
				html = html.replace(obj.token, obj.translated);
			});
		}
		// done
		fs.writeFileSync(config.TARGET_FOLDER + '/' + lang + '/' + config.PROJECT_PREFIX + '.html', html);
	});
});

gulp.task('psd', function(){
	var PSD = require('psd');
	var file;
	if(argv.file) {
		if(fs.existsSync(path.resolve(argv.file)))
			file = path.resolve(argv.file);
		else {
			console.log("Error: The file", argv.file, "does not exist");
			return process.exit();
		}
	}
	else if(config.SOURCE_PSD && fs.existsSync(path.resolve(config.SOURCE_PSD))) {
		file = path.resolve(config.SOURCE_PSD);
	}
	else {
		console.log("Error: \nExpected file", config.SOURCE_PSD, "or an invocation like: gulp psd --file filename.psd");
		return process.exit();
	}

	// Convert
	PSD.open(file)
	.then(function (psd) {
		return psd.image.saveAsPng(config.SOURCE_IMAGE);
	})
	.catch(function (err) {
	    console.log("ERROR: ", err);
	});
});

gulp.task('pdf', function(){
	if(!fs.existsSync(path.resolve(argv.file))) return console.error("Error: The file does not exist");

	// exec('convert -density 150 +profile "*"  ' + path.resolve(argv.file) + ' ' + config.SOURCE_IMAGE, function(status, output) {
	exec('convert -density 150 -strip  ' + path.resolve(argv.file) + ' ' + config.SOURCE_IMAGE, function(status, output) {
	  if(config.VERBOSE) console.log("Converted", dest);
	});
});

gulp.task('email', function(){

	// Mailing

	if(!argv.to) {
		console.log("Error: Invalid parameters. \n\nExpected: gulp email --to user@domain.com");
		return process.exit();
	}

	var nodemailer = require('nodemailer');
	var transporter = nodemailer.createTransport();

	var emailHTML = fs.readFileSync(process.cwd() + '/output/' + config.ORIGINAL_LANGUAGE + '/' + config.PROJECT_PREFIX + '.html').toString();
	var imagePattern = /<img alt="[^"]*" src=(['"])([a-z0-9\-\.]+)/ig;

	var emailImages = emailHTML.match(imagePattern) || [];

	function imgReplaceFunction(imgStr){
	   imgStr = imgStr.replace(/<img alt="[^"]*" src=(['"])/ig, '');
	   return {
	     filename: imgStr,
	     path: process.cwd() + '/output/' + config.ORIGINAL_LANGUAGE + '/' + imgStr,
	     cid: imgStr
	   };
	}

	emailImages = emailImages.map(imgReplaceFunction);

	emailHTML = emailHTML.replace(/<img alt="([^"]*)" src=(['"])([a-z0-9\-\.]+)/ig, "<img alt=\"$1\" src=$2cid:$3");

    transporter.sendMail({
       from: config.FROM_EMAIL,
       to: argv.to,
       subject: 'Test email (' + config.PROJECT_PREFIX + ')',
       text: 'This is an email demonstrating the final appearence of the template ' + config.PROJECT_PREFIX,
       html: emailHTML,
       attachments: emailImages
    });

    console.log("\nPlease, check on your spam folder (" + argv.to + ")\n");

});
