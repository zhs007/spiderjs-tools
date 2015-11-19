"use strict";

var sessionmgr = require('../base/sessionmgr');
var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    sessionmgr.singleton.procCookie(req, res);

    res.render('index', { title: 'Express' });
});

module.exports = router;
