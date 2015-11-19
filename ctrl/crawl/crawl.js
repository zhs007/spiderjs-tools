"use strict";

var ctrlmgr = require('./../ctrlmgr');
var fs = require("fs");
var path = require("path");
var http = require('http');

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