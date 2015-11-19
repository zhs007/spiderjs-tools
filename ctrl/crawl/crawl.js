"use strict";

var ctrlmgr = require('./../ctrlmgr');
var fs = require("fs");
var path = require("path");
var http = require('http');
var jsdom = require("jsdom");

var jquery = fs.readFileSync(path.join(__dirname, "./jsdompath/jquery.js"), "utf-8");
var jsxpath = fs.readFileSync(path.join(__dirname, "./jsdompath/javascript-xpath.js"), "utf-8");

function xpath(window, string, node) {
    let arr = [];
    let it = window.document.evaluate(string, node, null, window.XPathResult.ANY_TYPE, null);

    let tn = it.iterateNext();
    while (tn) {
        arr.push(tn);
        tn = it.iterateNext();
    }

    return arr;
}

class Ctrl_Crawl extends ctrlmgr.BaseCtrl {
    constructor() {
        super(ctrlmgr.CTRLID_CRAWL);
    }

    crawlurl(url, req, res, session) {
        let options = {
            hostname: 'cili007.com',
            port: 80,
            path: '/',
            method: 'GET',
            headers: {
                //'Content-Type': 'application/x-www-form-urlencoded',
                //'Content-Length': postData.length
            }
        };

        let htmlbuf = '';
        let httpreq = http.request(options, function(httpres) {
            console.log('STATUS: ' + httpres.statusCode);
            console.log('HEADERS: ' + JSON.stringify(httpres.headers));
            httpres.setEncoding('utf8');
            httpres.on('data', function (chunk) {
                htmlbuf += chunk;
            });
            httpres.on('end', function() {
                res.send(JSON.stringify({htmlinfo: htmlbuf}));

                session.htmlbuf = htmlbuf;

                return ;

                jsdom.env(htmlbuf, [jquery, jsxpath], function (err, window) {
                    var arr = xpath(window, '/html/body/div[@class="middle-box"]/div[@class="w"]/dl[@class="list-item"]/dd', window.document);
                    for (var i = 0; i < arr.length; ++i) {
                        console.log(arr[i].textContent);

                        var magnet = xpath(window, './@magnet', arr[i]);
                        console.log(magnet[0].textContent);
                    }
                });
            })
        });

        httpreq.on('error', function(e) {
            console.log('problem with request: ' + e.message);
        });

        httpreq.end();
    }

    onProc(req, res, session, params) {
        if (!params.hasOwnProperty('url')) {
            res.send(JSON.stringify({err: 'no url.'}));

            return ;
        }

        this.crawlurl(params.url, req, res, session);
    }
}

ctrlmgr.singleton.addCtrl(new Ctrl_Crawl());