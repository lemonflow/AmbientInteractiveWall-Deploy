var SyncConnectionSocketIO = (function () {
    "use strict";
    var sockjs = null;
    var self = null;
    
    function SyncConnectionSocketIO() {
        this.sockjs_url = 'http://192.168.3.56:3000/echo';
//        this.sockjs_url = 'http://127.0.0.1:3000/echo';
        this.sockjs = new SockJS(this.sockjs_url);
        
        sockjs = this.sockjs;
    }
    
    SyncConnectionSocketIO.prototype.startConnection = function() {
        self = this;
        FocusModel.instance.syncConnection = this;
        sockjs.onopen = function()  { 
            document.getElementById('debugtxt2').textContent = "open: "+clientid +" via "+sockjs.protocol;
            self.stateChange({'init': 1});
        };
        
        sockjs.onmessage = function(e) { //receiving
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
        
        sockjs.onclose   = function()  {
            document.getElementById('debugtxt2').textContent = "closed";
        };
    }
    
    SyncConnectionSocketIO.prototype.stateChange = function (obj) {
        if(sockjs.readyState==1) {
            obj['id'] = clientid;
            console.log("sending: "+JSON.stringify(obj));
            sockjs.send(JSON.stringify(obj));
        }
    }
    return SyncConnectionSocketIO;
})();
