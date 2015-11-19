"use strict";

class BaseCtrl{

    constructor(ctrlid) {
        this.ctrlid = ctrlid;
    }
}

class CtrlMgr{

    constructor() {
        this.mapCtrl = {};
    }

    addCtrl(ctrl) {
        if (!this.mapCtrl.hasOwnProperty(ctrl.ctrlid)) {
            this.mapCtrl[ctrl.ctrlid] = ctrl;
        }
    }

    onReq(req, res, session) {
        let params;

        if (req.method == 'POST') {
            params = req.body;
        }
        else if (req.method == 'GET') {
            params = req.query;
        }

        if (req.params.hasOwnProperty('ctrlid')) {
            params.ctrlid = req.params.ctrlid;

            if (this.mapCtrl.hasOwnProperty(params.ctrlid)) {
                this.mapCtrl[params.ctrlid].onProc(req, res, session, params);

                return ;
            }
        }

        res.send(JSON.stringify({err: 'no ctrl.'}));
    }
}

var singleton = new CtrlMgr();

exports.BaseCtrl = BaseCtrl;

exports.singleton = singleton;

//
exports.CTRLID_CRAWL = 'crawl';
exports.CTRLID_PARSER = 'parser';