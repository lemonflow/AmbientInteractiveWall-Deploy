var SlideDeckController = (function() {
    
    SlideDeckController.prototype = Object.create(OperatorStates.prototype);
    SlideDeckController.prototype.constructor = SlideDeckController;
    
    var _view = null;
    
    function SlideDeckController() {
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
                    {type:"viewAttached",
                        transition:[SlideDeckController.prototype.transitionPrepare],
                        newState:"pre"},

                    {type:"focusactivate",
                     transition:[SlideDeckController.prototype.transitionShow],
                     newState:"state0"}
                ]
            },
            {
                state:"state0",
                changes:
                [
                    {
                        type:"touchEnd",
                        guard:(function() { return (this.slideId<5); }),
                        transition:[SlideDeckController.prototype.transitionNextSlide],
                         newState:"state0"
                    },
                    {   type:"touchEnd",
                        guard:(function() { console.log(this); return (this.slideId>=5); }),
                        transition:[SlideDeckController.prototype.transitionHide,
                            SlideDeckController.prototype.transitionToCoverflow],
                        newState:"pre"
                    },
                    {type:"focusdeactivate",
                        transition:[SlideDeckController.prototype.transitionHide],
                        newState:"pre"
                    }
                ]
            }
        ];
    }
    
    SlideDeckController.prototype.initController = function(document) {
        document.getElementById(''+1).addEventListener('click', function(e) {
                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
            }.bind(this), false);

        document.getElementById(''+2).addEventListener('click', function(e) {
                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
            }.bind(this), false);
    }


///////////////////////////////////////////////////////////////////////////////////

    SlideDeckController.prototype.transitionPrepare = function() {
        for (var i = 0; i < this.view.objects.length; i++) {
            this.view.objects[i].material.opacity = 0.0;
        }
    }

    SlideDeckController.prototype.transitionShow = function() {
        new TWEEN.Tween(this.view.camera.position).to({
            x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
            new TWEEN.Tween(this.view.objects[i].material)
                .to({opacity: (i==this.slideId)?1.0:0}, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }
    }

    SlideDeckController.prototype.transitionHide = function() {
        new TWEEN.Tween(this.view.camera.position).to({
            x: 10, y: 10, z: 900}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();

        for(var i=0; i<this.view.objects.length;i++){
            new TWEEN.Tween(this.view.objects[i].material)
                .to({opacity: 0}, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }
    }

    SlideDeckController.prototype.transitionToCoverflow = function() {
        this.slideId = 0;
        var obj = {data1:"transitionToCoverflow"};
        syncConnection.stateChange(obj);
        FocusModel.instance.transferFocus(this,coverflow.controller);
    }

    ///////////////////////////////////////////////////////////////////////////////////

    
    SlideDeckController.prototype.syncTransition = function(obj) {
        if(obj.data1 == 'transitionToCoverflow') {
            FocusModel.instance.transferFocus(this,coverflow.controller);
        }

        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }
    
    //go through slideshow
    SlideDeckController.prototype.transitionUpdateSlide = function(e) {
        console.log(this);
        console.log("_________transition1");

        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        

        FocusModel.instance.syncConnection.stateChange(obj);

        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        if(this.slideId >= SlideDeckData.length) this.slideId =0;
           
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
    SlideDeckController.prototype.transitionSync = function(e) {
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = e.type;
        
        if(e.type =='prev') this.slideId--;
        if(e.type =='next') this.slideId++;
        if(this.slideId >= SlideDeckData.length) this.slideId =0;

        new TWEEN.Tween(this.view.camera.position).to({
            x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();
        for(var i=0; i<this.view.objects.length;i++){
             new TWEEN.Tween(this.view.objects[i].material)
                 .to({opacity: (i==this.slideId)?1.0:0.0}, 1000)
                 .easing(TWEEN.Easing.Exponential.Out)
                 .start();
        }
    }

    SlideDeckController.prototype.transitionNextSlide = function() {
        var obj = {};
        obj['data1'] = this.slideId;
        obj['data2'] = "next";

        if(++this.slideId >= SlideDeckData.length) this.slideId =0;

        for(var i=0; i<this.view.objects.length;i++){
            new TWEEN.Tween(this.view.objects[i].material)
                .to({opacity: (i==this.slideId)?1.0:0}, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }

        syncConnection.stateChange(obj);
    }




    ///////////////////////////////////////////

    return SlideDeckController;
})();
