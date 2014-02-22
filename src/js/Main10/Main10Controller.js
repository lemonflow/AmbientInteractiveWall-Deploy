var Main10Controller = (function() {
    
    Main10Controller.prototype = Object.create(OperatorStates.prototype);
    Main10Controller.prototype.constructor = Main10Controller;
    
    var _view = null;
    
    function Main10Controller() {
        OperatorStates.call(this);
        
        this.needsContinuousUpdate = false;
        this.slideId = -1;
        this.context = this;
        this.state = "pre";
        this.controls = null;
        this.flow = 
            [
             {
                state:"pre",
                changes:
                [
                    {type:"focusactivate",
                     transition:[Main10Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"next",
                     transition:[Main10Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"prev",
                     transition:[Main10Controller.prototype.transition1],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    Main10Controller.prototype.initController = function(document) { 
        document.getElementById(''+1).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
            }.bind(this), false);

        document.getElementById(''+2).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
            }.bind(this), false);
    }
    
    Main10Controller.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
   Main10Controller.prototype.initOperators = function(objects, operators) {
        var groupid = 0;
        for (var i = 0; i < objects.length; i++) {
            var object = objects[i];
            var object = new THREE.Object3D();
            object.position.x = 1000*i;
            object.position.y = 0 //100+200*i;
            object.position.z = 0;
            object.rotation.x = Math.PI/2;
            operators.overviewLayout.push(object);
        }
    }
    
    Main10Controller.prototype.layout = function(operators, duration,objects) {
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
    
    //go through slideshow
    Main10Controller.prototype.transition1 = function(e) {
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
      FocusModel.instance.syncConnection.stateChange(obj, e);
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: ((this.slideId*1000)+10), y: 10, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==this.slideId)?1.0:0.5}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
    }
    
        //go through slideshow triggered by other call
    Main10Controller.prototype.transitionSync = function(e) {
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: ((this.slideId*1000)+10), y: 10, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==this.slideId)?1.0:0.5}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
    }

    
    return Main10Controller;
})();
