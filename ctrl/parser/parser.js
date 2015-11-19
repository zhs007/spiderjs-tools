"use strict";

var ctrlmgr = require('./../ctrlmgr');
var fs = require("fs");
var path = require("path");
var jsdom = require("jsdom");

var jquery = fs.readFileSync(path.join(__dirname, "./jsdompath/jquery.js"), "utf-8");
var jsxpath = fs.readFileSync(path.join(__dirname, "./jsdompath/javascript-xpath.js"), "utf-8");

var itemlist = [];

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

class Ctrl_Parser extends ctrlmgr.BaseCtrl {
    constructor() {
        super(ctrlmgr.CTRLID_PARSER);
    }

    parser(code, req, res, session) {
        let htmlbuf = session.htmlbuf;

        jsdom.env(htmlbuf, [jquery, jsxpath], function (err, window) {
            eval(code);
            //var arr = xpath(window, '/html/body/div[@class="middle-box"]/div[@class="w"]/dl[@class="list-item"]/dd', window.document);
            for (var i = 0; i < itemlist.length; ++i) {
                console.log(itemlist[i].textContent);

                //var magnet = xpath(window, './@magnet', arr[i]);
                //console.log(magnet[0].textContent);
            }
        });
    }

    onProc(req, res, session, params) {
        if (!params.hasOwnProperty('code')) {
            res.send(JSON.stringify({err: 'no code.'}));

            return ;
        }

        this.parser(params.code, req, res, session);
    }
}

ctrlmgr.singleton.addCtrl(new Ctrl_Parser());