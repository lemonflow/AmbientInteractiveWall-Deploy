var Main12Controller = (function() {
    
    Main12Controller.prototype = Object.create(OperatorStates.prototype);
    Main12Controller.prototype.constructor = Main12Controller;
    
    var _view = null;
    
    function Main12Controller() {
        OperatorStates.call(this);
        
        this.needsContinuousUpdate = false;
        this.slideId = 0;
        this.context = this;
        this.state = "pre";
        this.controls = null;
        this.flow = [
             {
                state:"pre",
                changes:
                [
                    {type:"focusactivate",
                     transition:[Main12Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"next",
                     transition:[Main12Controller.prototype.transition1],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"prev",
                     transition:[Main12Controller.prototype.transition1],
                     newState:"state0"}
                ]
            }
        ];
    }
    
    Main12Controller.prototype.initController = function(document) { 
        document.getElementById(''+1).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
            }.bind(this), false);

        document.getElementById(''+2).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
            }.bind(this), false);
    }
    
    Main12Controller.prototype.syncTransition = function(obj) {
//        if(!obj.hasOwnProperty('data1') || !obj.')) return;
        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
    //go through slideshow
    Main12Controller.prototype.transition1 = function(e) {
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
      FocusModel.instance.syncConnection.stateChange(obj);
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        
        console.log(this.view.objects.length);
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==this.slideId)?1.0:0}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
    }
    
        //go through slideshow triggered by other call
    Main12Controller.prototype.transitionSync = function(e) {
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        
        new TWEEN.Tween(this.view.camera.position).to({ 
            x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==this.slideId)?1.0:0.0}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
    }

    
    return Main12Controller;
})();
