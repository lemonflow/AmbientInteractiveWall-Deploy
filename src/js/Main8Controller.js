var Main8Controller = (function () {
    
    Main8Controller.prototype = Object.create(OperatorStates.prototype);
    Main8Controller.prototype.constructor = Main8Controller;
    
    var _view = null;
    
    function Main8Controller() {
        OperatorStates.call(this);
        
        this.slideId = -1;
        this.context = this;
        this.state = "pre";
        this.controls = null;
        this.needsContinuousUpdate = false;
        this.flow = 
            [
            {
                state:"pre",
                changes:
                [
                    {type:"focusactivate",
                     transition:[Main8Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"play",
                     transition:[Main8Controller.prototype.transition2],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    Main8Controller.prototype.initController = function() {
        document.getElementById(''+1).addEventListener('click', function(e) { 
            InputManager.getInstance().dispatchEvent(new InputEvent("play"));
        }.bind(this), false);
        
         this.media = document.getElementById('video');
    }
    
    Main8Controller.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
    Main8Controller.prototype.initOperators = function(objects, operators) {}
    Main8Controller.prototype.layout = function(operators, duration,objects) {}
    
    //actual states
    Main8Controller.prototype.transition1 = function(e) {
        Main8ControllerThis = this;
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
//        if((this.slideId <= 1 && e.type =='prev') || (this.slideId>=3 && e.type =='next')) return;
//        if(e.type =='prev') this.slideId--;
//        if(e.type =='next') this.slideId++;
        
        FocusModel.instance.syncConnection.stateChange(obj, e);
        
        new TWEEN.Tween(this.view.objects[0].material)
            .to({opacity: 0.1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.camera.position)
            .to({ x: 0, y: 0, z: 550}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        
//        this.media.pause();
//        this.media.currentTime = 0; // Seek to 122 seconds
        
    }
        
    Main8Controller.prototype.transition2 = function(e) {
        var obj = {};
        FocusModel.instance.syncConnection.stateChange(obj, e);
        
        new TWEEN.Tween(this.view.objects[0].material)
            .to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.objects[0].position)
            .to({x: 0, y: 10, z: 400}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.camera.position)
            .to({ x: 0, y: 10, z: 493}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        document.getElementById( 'video' ).play();
    }
    
    //receiving
    Main8Controller.prototype.transitionSync = function(e) {
        new TWEEN.Tween(this.view.objects[0].material)
            .to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.objects[0].position)
            .to({x: 0, y: 0, z: 300}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.camera.position)
            .to({ x: 0, y: 10, z: 493}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        document.getElementById( 'video' ).play();
    }
    return Main8Controller;
    
})();




//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
//
////Controlling the Main View's Interaction
//var Main8Controller = (function () {
//    "use strict";
//    var oldState = "state0";
//    var state = "state0";
//    var spread = 200;
//    
//    function Main8Controller(v) {
//        this.view = v;
//        
//    }
//    
//    Main8Controller.prototype.initController = function(document) {
//        //general mouse clicks
//        document.addEventListener('click', function(e) { this.onEvent(e); }.bind(this), true);
//        
//        //general element clicks
//        for(var i=1;i<9;i++) {
//            var t = document.getElementById(''+i);
//            t.addEventListener('click', function(e) { this.executeTransition(e.target.id, true); }.bind(this), false);
//        }
//    }
//    Main8Controller.prototype.executeTransition = function(transitionId, sendUpdate) {
//        oldState = state;
//        switch(transitionId) {
//            case '1': this.transition1(); break;
//            case '2': this.transition2(); break;
//            case '3': this.transition3(); break;
//        }
//        
//        if(sendUpdate) 
//            syncConnection.sendState({'type':'transition', '0':oldState,'1':state,'2':transitionId});
//    }
//    
//    Main8Controller.prototype.onEvent = function(e) {
//        console.log(e.type);
//        //        if(e.type=='click') sync.clientc.send({'type':e.type,'0':e.x,'1':e.y});
//    }
//    
//    //____________________
//    
//    Main8Controller.prototype.initOperators = function(objects, operators) {
//    }
//    
//    Main8Controller.prototype.layout = function(operators, duration,objects) {
//    }
//    
//    //__________________
//    
//    
//    Main8Controller.prototype.transition1 = function() {
//        state = "state1";
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.camera.position).to({ x: 0, y: 0, z: 550}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        
//        var media = document.getElementById('video');
//        media.pause();
//        media.currentTime = 0; // Seek to 122 seconds
//    }
//    
//    Main8Controller.prototype.transition2 = function() {
//        state = "state2";
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.camera.position).to({ x: 0, y: 10, z: 500}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        document.getElementById( 'video' ).play();
//    }
//    
//    Main8Controller.prototype.transition3 = function() {
//        state = "state3";
//        
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    return Main8Controller;
//})();