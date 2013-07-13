#!/usr/bin/env node
/*
Automatically grade files for the presence of specified HTML tags/attributes.
Uses commander.js and cheerio. Teaches command line application development
and basic DOM parsing.

References:

 + cheerio
   - https://github.com/MatthewMueller/cheerio
   - http://encosia.com/cheerio-faster-windows-friendly-alternative-jsdom/
   - http://maxogden.com/scraping-with-node.html

 + commander.js
   - https://github.com/visionmedia/commander.js
   - http://tjholowaychuk.com/post/9103188408/commander-js-nodejs-command-line-interfaces-made-easy

 + JSON
   - http://en.wikipedia.org/wiki/JSON
   - https://developer.mozilla.org/en-US/docs/JSON
   - https://developer.mozilla.org/en-US/docs/JSON#JSON_in_Firefox_2
*/

var fs = require('fs');
var program = require('commander');
var cheerio = require('cheerio');
var rest = require('restler');
var HTMLFILE_DEFAULT = "test1.html";
var CHECKSFILE_DEFAULT = "checks.json";
var URL_DEFAULT = "https://boiling-ridge-6056.herokuapp.com";
var assertFileExists = function(infile) {
    var instr = infile.toString();
    if(!fs.existsSync(instr)) {
        console.log("%s does not exist. Exiting.", instr);
        process.exit(1); // http://nodejs.org/api/process.html#process_process_exit_code
    }
//    console.log('assertFile Exists'  + instr);
    return instr;
};
var assertUrlExists = function(url){
   rest.get(url).on('complete', function(result) {
       if(result instanceof Error)
	   {
	       console.log('eror' + url);
	       process.exit(1);
	   }
  //     console.log('urlExists' + url);
checkHtmlUrl(result, program.checks);       
//return result ;
   });
};
var cheerioHtmlFile = function(htmlfile) {
    return cheerio.load(fs.readFileSync(htmlfile));
};

var loadChecks = function(checksfile) {
    return JSON.parse(fs.readFileSync(checksfile));
};

var checkHtmlFile = function(htmlfile, checksfile) {
    $ = cheerioHtmlFile(htmlfile);
    var checks = loadChecks(checksfile).sort();
    var out = {};
    for(var ii in checks) {
        var present = $(checks[ii]).length > 0;
        out[checks[ii]] = present;
    }
    return out;
};

var checkHtmlUrl = function(htmlUrlContent, checksfile) {
    $ = cheerio.load(htmlUrlContent);
    //console.log('cheeio load');
    var checks = loadChecks(checksfile).sort();
    var out = {};
    //console.log('load checks');
//console.log(assertUrlExists(htmlUrlContent));
  //  console.log($);
    for(var ii in checks) {

//	console.log(ii + ":" + checks[ii] + "'" + $(checks[ii]) );
	var present = $(checks[ii]).length > 0;
	out[checks[ii]] = present;
    }	
	var outJson =  JSON.stringify(out, null, 4);
        console.log(outJson);
};
var clone = function(fn) {
    // Workaround for commander.js issue.
    // http://stackoverflow.com/a/6772648
    return fn.bind({});
};

if(require.main == module) {
    program
        .option('-f, --file <html_file>', 'Path to index.html', clone(assertFileExists), HTMLFILE_DEFAULT)
        .option('-c, --checks <check_file>', 'Path to checks.json', clone(assertFileExists), CHECKSFILE_DEFAULT)
        .option('-u, --url <url>', 'Path to url', clone(assertUrlExists), URL_DEFAULT)
        .parse(process.argv);

    var checkJson;
    if(program.file != 'test1.html'){
	checkJson = checkHtmlFile(program.file, program.checks);
	var outJson =  JSON.stringify(checkJson, null, 4);
        console.log(outJson);
}
    else{
	console.log('inside url lopp)');
	for(var i = 0; i < process.argv.length; i++){ 
	    var val = process.argv[i];
//	    console.log(val + ";" + val.indexOf('http'));
	    if(val.indexOf('http') > -1){
//		console.log('found' + val);
                 //checkHtmlUrl(val, program.checks);
		assertUrlExists(val);
		}
        }
    }
} else {
    exports.checkHtmlFile = checkHtmlFile;
}

