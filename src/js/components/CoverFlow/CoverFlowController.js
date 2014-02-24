var CoverflowController = (function() {
    
    CoverflowController.prototype = Object.create(OperatorStates.prototype);
    CoverflowController.prototype.constructor = CoverflowController;
    
    var _view = null;
    
    function CoverflowController() {
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
                     transition:[CoverflowController.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"next",
                     transition:[CoverflowController.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"prev",
                     transition:[CoverflowController.prototype.transition1],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    CoverflowController.prototype.initController = function(document) {
        document.getElementById(''+1).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
            }.bind(this), false);

        document.getElementById(''+2).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
            }.bind(this), false);
    }
    
    CoverflowController.prototype.syncTransition = function(obj) {
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
   CoverflowController.prototype.initOperators = function(objects, operators) {
        var groupid = 0;
        for (var i = 0; i < objects.length; i++) {
            var referenceObj = new THREE.Object3D();
            referenceObj.position.x = 1000*i;
            referenceObj.position.y = 0 //100+200*i;
            referenceObj.position.z = 0;
            referenceObj.rotation.x = Math.PI/2;
            operators.overviewLayout.push(referenceObj);
        }
    }
    
    CoverflowController.prototype.layout = function(operators, duration,objects) {
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
    CoverflowController.prototype.transition1 = function(e) {
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
    CoverflowController.prototype.transitionSync = function(e) {
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

    CoverflowController.prototype.touchMove = function(posX, posY) {
        this.view.objects[0].position.x = -2560+posX;
    }

    CoverflowController.prototype.touchDown = function(posX, posY) {
        this.view.objects[0].position.x = -2560;
    }

    CoverflowController.prototype.touchUp = function(posX, posY) {
    }

    return CoverflowController;
})();
