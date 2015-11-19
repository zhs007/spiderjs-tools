"use strict";

var util = require('util');

var wordarr = 'abcdefghijklmnopqrstuvwxyz';

var MAX_TIME = 20 * 60 * 1000;

class SessionMgr{

    constructor() {
        this.mapSession = {};

        let smgr = this;
        setInterval(function () {
            let ts = Date.now();
            for (let sid in smgr.mapSession) {
                if (ts - smgr.mapSession[sid].lastts > MAX_TIME) {
                    smgr.mapSession[sid] = undefined;
                }
            }
        }, 1000 * 60);
    }

    makeSessionID() {
        let sid = '';

        for (let i = 0; i < 3; ++i) {
            let c = Math.floor(Math.random() * 26);
            if (c == 26) {
                c = 25;
            }

            sid += wordarr.slice(c, c + 1);
        }

        sid += Date.now();

        for (let i = 0; i < 7; ++i) {
            let c = Math.floor(Math.random() * 26);
            if (c == 26) {
                c = 25;
            }

            sid += wordarr.slice(c, c + 1);
        }

        return sid;
    }

    makeValidSessionID() {
        let sid = this.makeSessionID();
        if (this.mapSession.hasOwnProperty(sid)) {
            return this.makeValidSessionID();
        }

        return sid;
    }

    procCookie(req, res) {
        if (req.signedCookies.sessionid) {
            req.sessionid = req.signedCookies.sessionid;
        }
        else {
            req.sessionid = this.makeValidSessionID();
        }

        if (!this.mapSession.hasOwnProperty(req.sessionid)) {
            this.mapSession[req.sessionid] = {lastts: Date.now()};
        }
        else {
            this.mapSession[req.sessionid].lastts = Date.now();
        }

        res.cookie('sessionid', req.sessionid, {signed: true});

        return this.mapSession[req.sessionid];
    }
}

var singleton = new SessionMgr();

exports.singleton = singleton;