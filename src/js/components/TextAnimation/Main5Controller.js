
//Controlling the Main View's Interaction
var Main5Controller = (function () {
    "use strict";
    var oldState = "state0";
    var state = "state0";
    
    function Main5Controller(v) {
        this.view = v;
        this.controls = null;
    }
    
    Main5Controller.prototype.initController = function(document) { }
    Main5Controller.prototype.executeTransition = function(transitionId, sendUpdate) {
        oldState = state;
        switch(transitionId) {
            case '1': this.transition1(); break;
        }
        if(sendUpdate) 
            syncConnection.sendState({'type':'transition', '0':oldState,'1':state,'2':transitionId});
    }
    Main5Controller.prototype.initOperators = function(objects, operators) {}
    Main5Controller.prototype.layout = function(operators, duration,objects) {}
    Main5Controller.prototype.transition1 = function() {
        state = "state1";
     }
    return Main5Controller;
})();