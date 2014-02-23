
//Controlling the Main View's Interaction
var Main9Controller = (function () { 
    Main9Controller.prototype = Object.create(OperatorStates.prototype);
    Main9Controller.prototype.constructor = Main9Controller;
    
    var _view = null;
    
    function Main9Controller() {
        OperatorStates.call(this);
        
        this.slideId = 0;
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
                     transition:[Main9Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"next",
                     transition:[Main9Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"prev",
                     transition:[Main9Controller.prototype.transition1],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    Main9Controller.prototype.initController = function() {
        document.getElementById(''+1).addEventListener('click', function(e) { 
            InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
        }.bind(this), false);
        
        document.getElementById(''+2).addEventListener('click', function(e) { 
            InputManager.getInstance().dispatchEvent(new InputEvent("next"));
        }.bind(this), false);
    }
    
    Main9Controller.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
    Main9Controller.prototype.initOperators = function(objects, operators) {}
    Main9Controller.prototype.layout = function(operators, duration,objects) {}
    
    //go through slideshow
    Main9Controller.prototype.transition1 = function(e) {
        Main9ControllerThis = this;
        console.log(this.slideId +' '+e.type);
        
        if((this.slideId <= 1 && e.type =='prev')) 
            return;
        
//        if (this.slideId=='2') 
//            this.slideId == -1;
        
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
        
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
//        
        console.log(this.slideId);
//        FocusModel.instance.syncConnection.stateChange(obj, e);
        THREE.ImageUtils.loadTexture.call(Main9ControllerThis, 
                                          './assets/wide'+this.slideId+'.png', 
                                              new THREE.UVMapping(),  function(texture) {
                                              Main9ControllerThis.view.assignTextureMap(texture);
                                              Main9ControllerThis.view.simulationTrigger(texture);
                                          });
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: 0, y: 0, z: 0}, 10000).easing(TWEEN.Easing.Exponential.Out) .start();
        
        for(var i=0; i<this.view.objects.length;i++){
             this.view.objects[i].material.opacity = 0;
        }
        
        console.log(this.view.objects.length);
        
//        for(var i=0; i<this.view.objects.length;i++){
//             new TWEEN.Tween(this.view.objects[i].material)
//                 .to({opacity: (i==(this.slideId-1))?1.0:0}, 1000)
//                 .easing(TWEEN.Easing.Exponential.Out).delay(0)
//                 .start();
//            new TWEEN.Tween(this.view.objects[i].material)
//                 .to({opacity: (i==(this.slideId-1))?0:1}, 0)
//                 .easing(TWEEN.Easing.Exponential.Out).delay(1500)
//                 .start();
//        }
        
        
        
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: 0, y: 0, z: 410}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
//        new TWEEN.Tween(this.view.camera.position).to({x: 300}, 5000).easing(TWEEN.Easing.Quadratic.InOut).start();
    }
    
    Main9Controller.prototype.transitionSync = function(e) {
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==(this.slideId-1))?1.0:0}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
        
        THREE.ImageUtils.loadTexture.call(Main9ControllerThis, 
                                          './assets/wide'+this.slideId+'.png', 
                                          new THREE.UVMapping(),  function(texture) {
                                              Main9ControllerThis.view.assignTextureMap(texture);
                                              Main9ControllerThis.view.simulationTrigger(texture);
                                          });
    }
    return Main9Controller;
    
})();