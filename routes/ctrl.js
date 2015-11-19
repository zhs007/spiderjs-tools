"use strict";

require('../ctrl/crawl/crawl');
require('../ctrl/parser/parser');

var ctrlmgr = require('../ctrl/ctrlmgr');
var sessionmgr = require('../base/sessionmgr');

var express = require('express');
var router = express.Router();

/* GET home page. */
router.all('/:ctrlid/', function(req, res, next) {
    let session = sessionmgr.singleton.procCookie(req, res);

    ctrlmgr.singleton.onReq(req, res, session);
});

module.exports = router;
