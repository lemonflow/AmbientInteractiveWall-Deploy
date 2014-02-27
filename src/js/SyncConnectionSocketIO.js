var SyncConnectionSocketIO = (function () {
    "use strict";
    var sockjs = null;
    var self = null;
    var reconnectSyncConnectionId = 0;
    
    function SyncConnectionSocketIO() {
        this.sockjs_url = 'http://192.168.3.56:3000/echo';
//        this.sockjs_url = 'http://127.0.0.1:3000/echo';

        self = this;
        FocusModel.instance.syncConnection = this;

        this.reconnectId = 0;
        this.reconnectId  = setInterval(this.checkConnection.bind(this), 2500);
    }
    
    SyncConnectionSocketIO.prototype.startConnection = function() {
        this.sockjs = new SockJS(this.sockjs_url);
        this.sockjs.onopen = function()  {
            console.log(this);
            document.getElementById('debugtxt2').textContent = "open: "+clientid +" via "+this.sockjs.protocol;
            this.stateChange({'init': 1});
        }.bind(this);

        this.sockjs.onmessage = function(e) { //receiving
            console.log("r: "+e.data);
            var obj = JSON.parse(e.data);
//            document.getElementById('debugtxt').textContent = "received: "+e.data;
            if(obj['id'] != clientid && !obj.hasOwnProperty('init')) {
                FocusModel.instance.focusController.syncTransition(obj);
            }
            
            if(obj['id'] != clientid && obj.hasOwnProperty('reload')) {
                location.reload(1);
            }
        };

        this.sockjs.onclose = function()  {
            document.getElementById('debugtxt2').textContent = "closed.";
            this.sockjs = null;

        }.bind(this);
    }
    SyncConnectionSocketIO.prototype.checkConnection = function (obj) {
        if(this.sockjs == null) {
            document.getElementById('debugtxt2').textContent = "reconnecting...";
            this.startConnection();
        }
    }

    SyncConnectionSocketIO.prototype.stateChange = function (obj) {
        if(this.sockjs.readyState==1) {
            obj['id'] = clientid;
            console.log("sending: "+JSON.stringify(obj));
            this.sockjs.send(JSON.stringify(obj));
        }
    }
    return SyncConnectionSocketIO;
})();
