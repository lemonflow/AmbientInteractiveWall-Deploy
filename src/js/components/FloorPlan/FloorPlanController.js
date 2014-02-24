var FloorPlanController = (function () {
    
    FloorPlanController.prototype = Object.create(OperatorStates.prototype);
    FloorPlanController.prototype.constructor = FloorPlanController;
    
    var _view = null;
    var spread = 200;
    
    function FloorPlanController() {
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
                     transition:[FloorPlanController.prototype.transition1],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    FloorPlanController.prototype.initController = function() {
        document.getElementById(''+1).addEventListener('click', function(e) { 
            InputManager.getInstance().dispatchEvent(new InputEvent("play"));
        }.bind(this), false);
    }
    
    FloorPlanController.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    FloorPlanController.prototype.initOperators = function(objects, operators) {
        var groupid = 0;
        for (var i = 0; i < objects.length; i++) {
            var item = Main6Data[i];
            var object = objects[i];
            var object = new THREE.Object3D();
            object.position.x = 0 //100+200*i;
            object.position.y = 0 //100+200*i;
            object.position.z = -spread + spread * ~~(i/3) + ((i%3) * 1);
            operators.overviewLayout.push(object);
        }
    }
    
    FloorPlanController.prototype.layout = function(operators, duration,objects) {
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            var target = operators[i];
            
            new TWEEN.Tween(object.position).to({
                x: target.position.x, 
                y: target.position.y, 
                z: target.position.z
            }, duration).easing(TWEEN.Easing.Exponential.InOut).start();
            
            new TWEEN.Tween(object.rotation).to({
                x: target.rotation.x,
                y: target.rotation.y,
                z: target.rotation.z
            }, duration) .easing(TWEEN.Easing.Exponential.InOut).start();
        }
    }
    
    FloorPlanController.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
    
    //actual states
    FloorPlanController.prototype.transition0 = function(e) {
        FloorPlanController = this;
        
        var obj = {'pos':0};
        FocusModel.instance.syncConnection.stateChange(obj, e);
        
        //        
        this.view.objects[7].material.opacity = 0;
        this.view.objects[8].material.opacity = 0;
        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.camera.position)
        .to({ x: 10, y: -700, z: 600}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        new TWEEN.Tween(this.view.objects[0].material)
        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[3].material)
        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[6].material)
        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        
        //        for (var i = 0; i < this.view.objects.length; i++) 
        //            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
    }
    
    
    
    FloorPlanController.prototype.transition1 = function(e) {
        
        var obj = {'pos':1};
        FocusModel.instance.syncConnection.stateChange(obj, e);
        
        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        new TWEEN.Tween(this.view.camera.position)
        .to({ x: 10, y: 10, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        new TWEEN.Tween(this.view.objects[0].material)
        .to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[3].material)
        .to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[6].material)
        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        for (var i = 0; i < this.view.objects.length; i++) 
            new TWEEN.Tween(this.view.objects[i].position)
            .to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
    }
    
    
    //receiving
    FloorPlanController.prototype.transitionSync = function(e) {
        
               
        new TWEEN.Tween(this.view.camera.position)
        .to({ x: 10, y: 10, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        new TWEEN.Tween(this.view.objects[0].material)
        .to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[3].material)
        .to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        new TWEEN.Tween(this.view.objects[6].material)
        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        for (var i = 0; i < this.view.objects.length; i++) 
            new TWEEN.Tween(this.view.objects[i].position)
            .to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        
        
//        new TWEEN.Tween(this.view.camera.position)
//        .to({ x: 10, y: -700, z: 600}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material)
//        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material)
//        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material)
//        .to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
    }
    return FloorPlanController;
    
})();
//
//    FloorPlanController.prototype.transition0 = function() {
//        state = "state1";
//        
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: -700, z: 600}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//                
//
////        for (var i = 0; i < this.view.objects.length; i++) 
////            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    FloorPlanController.prototype.transition1 = function() {
//        state = "state2";
//        
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: 10, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    
//    FloorPlanController.prototype.transition2 = function() {
//        state = "state3";
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: 10, z: 600}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//    }
//    
//    FloorPlanController.prototype.transition3 = function() {
//        state = "state4";
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: 10, z: 300}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.05}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    FloorPlanController.prototype.transition4 = function() {
//        state = "state5";
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: -500, z: 400}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        this.layout(this.view.operators.overviewLayout, 1000, this.view.objects );
//    }
//    
//    FloorPlanController.prototype.transition5 = function() {
//        state = "state6";
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 10, y: -500, z: 1100}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.9}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    FloorPlanController.prototype.transition6= function() {
//        state = "state7";
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 1;
//        
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: 100, y: 100, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.8}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: -400}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    FloorPlanController.prototype.transition7 = function() {
//        state = "state8";
//        this.view.objects[7].material.opacity = 1;
//        this.view.objects[8].material.opacity = 0;
//        
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        new TWEEN.Tween(this.view.camera.position).to({ x: -100, y: -100, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.objects[0].material).to({opacity: 0.1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[3].material).to({opacity: 0.1}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.objects[6].material).to({opacity: 0.8}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 400}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//    }
//    
//    FloorPlanController.prototype.transition8 = function() {
//        state = "state9";
//        
//        this.view.objects[7].material.opacity = 0;
//        this.view.objects[8].material.opacity = 0;
//        //        new TWEEN.Tween(objectSide.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        //        new TWEEN.Tween(objectSide2.material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        new TWEEN.Tween(this.view.camera.position).to({ x: 100, y: 300, z: 2000}, 7000).easing(TWEEN.Easing.Exponential.Out) .start();
//        
//        for (var i = 0; i < this.view.objects.length; i++) 
//            new TWEEN.Tween(this.view.objects[i].position).to({x: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
//        
//        
//    }
//    
//    return FloorPlanController;
//})();