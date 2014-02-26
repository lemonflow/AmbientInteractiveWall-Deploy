var SyncConnectionNow = (function () {
    
    function SyncConnectionNow() {
    }
    
    SyncConnectionNow.prototype.startConnection = function() {
        self = this;
        FocusModel.instance.syncConnection = this;
        sockjs.onopen = function()  { 
            document.getElementById('debugtxt').textContent = "open: "+clientid +" via "+sockjs.protocol;
        };
        
        
        now.receiveData = function(obj) {
             document.getElementById('debugtxt').textContent = "received: "+obj;
            if(obj['id'] != clientid) {
                FocusModel.instance.focusController.syncTransition(obj);
            }
        }
        
         now.distributeMessage("temp");
        
    }
    
    SyncConnectionNow.prototype.stateChange = function(obj, evt) {
        console.log(obj);
        obj['id'] = clientid;
        now.obj = obj;
        now.distributeData(obj);
    }
    return SyncConnectionNow;
})();
