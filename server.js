#!/usr/bin/env node
'use strict';

// Thank you for taking the time to write this program. This is a take home problem that you have 120 minutes to complete. You can use libraries that will assist with writing the program, but don’t use a library (or a tutorial) that handles most of this for you.

// Write a command-line program that crawls a website and returns all page URLs that contain a specific search keyword. For example,

// $ ./my_crawler https://www.apple.com reimagined
// $ Crawled 342 pages. Found 14 pages with the term ‘reimagined’:
// $ https://www.apple.com/ => ‘We reimagined everything.’
// $ https://www.apple.com/iphone => ‘she reimagined my face’
// $ https://www.apple.com/iphone/deeplink => ‘ou reimagined me’

// The precise form of the output doesn’t matter. But note the key elements: total pages crawled, total pages with results, a listing of each URL, and some context characters around the keyword (you can display more context than the 3 chars on each side shown above). Other details:
// Crawl two levels deep from the initial page
// Don’t worry about the program’s input initially. If you want to hardcode the input, you can save getting the proper inputs from the command line at the end. Focus on the core functionality
// Ignore pages on a different domain
// Only look at server-side generated content (plain old markup) - ignore client-side generated content (JS- generated markup)
// Only search for content within the HTML, not the HTML content itself (i.e., searching for the term ‘div’ should usually return nothing unless the term div is in the content itself)
// [Optional] Have it crawl efficiently (faster than 10 URLs per second)
// [Optional] Specify the depth of the search as a command line input


var express = require('express');
var fs      = require('fs');
var request = require('request');
var cheerio = require('cheerio');
var app     = express();
const program = require('commander');

const minimist = require('minimist');



module.exports = () => {
  console.log('Welcome to the crawl search for a website!');
  const args = minimist(process.argv.slice(2));
  console.log(args);

  const searchurl = args._[0];  // todo: need arg error checking and notifications
  const searchterm = args._[1];
  var deepenough = false;
  console.log("search " + searchurl + " for " + searchterm);

  request(searchurl, function(error, response, html) {

      var searchdaurl = function() {

// // Write a command-line program that crawls a website and returns all page URLs that contain a specific search keyword. For example,
//
// // $ ./my_crawler https://www.apple.com reimagined
// // $ Crawled 342 pages. Found 14 pages with the term ‘reimagined’:
// // $ https://www.apple.com/ => ‘We reimagined everything.’
// // $ https://www.apple.com/iphone => ‘she reimagined my face’
// // $ https://www.apple.com/iphone/deeplink => ‘ou reimagined me’
//

        //todo: get the words before and after by slicing the string around the location

        var findText = function () {
          $('*').each(function () {
            var text = $(this).text();
            if (text) {
              const loc = text.toString().indexOf(searchterm);
              //  console.log("text is "+ text);
              if (loc >= 0) {
                console.log("found search: " + searchterm + " at " + loc);
              }
            }
          });
        };


        var nextLevel = function () {
          if (deepenough) return; // just do one level
          deepenough = true;
          $('a').each(function () {
            var text = $(this).text();
            var link = $(this).attr('href');

            // var pat = /^https?:\/\//i; // check for relativity (pat.test(link))  <== a slower but more accurate regx search method for full links
            if (link) {
              const isfulllocallink = (((link.toString().indexOf('http://') === 0 || link.toString().indexOf('https://') === 0)) || link.toString().indexOf(searchurl) === 0);

              if (isfulllocallink) {
                console.log("Searching ... " + text.trim() + ' --> ' + link);
                request(link, function(error, response, html) {
                  console.log("searching "+ link.toString());
                  $ = cheerio.load(html);
                  findText();
                });
              }
            }
            ;
          });
        };

        var $ = cheerio.load(html);
        findText();
        nextLevel();
      };

    if (!error) {
      searchdaurl();
    }
  });

};

