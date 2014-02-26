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
                         {type:"viewAttached",
                             transition:[CoverflowController.prototype.transitionPrepare],
                             newState:"pre"},

                         {type:"focusactivate",
                             transition:[CoverflowController.prototype.transitionShow],
                             newState:"state0"}
                     ]
            },
            {
                state:"state0",
                changes:
                [
                    {type:"next",
                     transition:[CoverflowController.prototype.transition1],
                     newState:"state0"},

                    {type:"prev",
                        transition:[CoverflowController.prototype.transition1],
                        newState:"state0"},

                    {type:"focusdeactivate",
                        transition:[CoverflowController.prototype.transitionHide],
                        newState:"pre"},

                    {type:"touchSwipeMove",
                        transition:[CoverflowController.prototype.transitionSwipe],
                        newState:"state0"
                    },

                    {type:"touchEnd",
                        guard:(function() {return (TouchDevice.currentY<200)}),
                        transition:[
                            CoverflowController.prototype.transitionHide,
                            CoverflowController.prototype.transitionToFloorPlan
                        ],
                        newState:"pre"
                    }
                ]
            }
        ];
    }


    ///////////////////////////////////////////
    ///////////////////////////////////////////
    CoverflowController.prototype.transitionPrepare = function() {
        this.view.camera.position.x = 0;
        this.view.camera.position.y = 0;
        this.view.camera.position.z = 521;

        for (var i = 0; i < this.view.objects.length; i++) {
            this.view.objects[i].material.opacity = 0.0;
        }
    }

    CoverflowController.prototype.transitionShow = function() {
        new TWEEN.Tween(this.view.camera.position).to({
            x: ((2*1000)+10), y: 10, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();

        for(var i=0; i<this.view.objects.length;i++){
            new TWEEN.Tween(this.view.objects[i].material)
                .to({opacity: (i==this.slideId)?1.0:0.5}, 1000)
                .easing(TWEEN.Easing.Exponential.Out)
                .start();
        }
    }

    CoverflowController.prototype.transitionHide = function() {
        new TWEEN.Tween(this.view.camera.position)
            .to({  x: 0, y: 0, z: 521}, 1000).easing(TWEEN.Easing.Exponential.Out) .start();

        for (var i = 0; i < this.view.objects.length; i++) {
            new TWEEN.Tween(this.view.objects[i].material).to({opacity: 0}, 1000).easing(TWEEN.Easing.Exponential.Out).start();
        }
    }

    CoverflowController.prototype.transitionToFloorPlan= function() {
        FocusModel.instance.transferFocus(this,floorPlan.controller);


        var obj = {data1:"transitionToSlideShow"};
        syncConnection.stateChange(obj);
    }
    ///////////////////////////////////////////
    ///////////////////////////////////////////

    CoverflowController.prototype.syncTransition = function(obj) {
        if(obj.data1 == 'transitionToSlideShow') {
            FocusModel.instance.transferFocus(this,slideDeck.controller);
            return;
        }

        if(obj.data1 == 'transitionSwipe') {

            this.view.camera.position.x = (clientid-50)*1000+(1280-obj.data2)+10;
            return;
        }

        this.slideId = obj.data1;
        this.transitionSync(new InputEvent(obj.data2));
    }

    CoverflowController.prototype.initController = function(document) {
        document.getElementById(''+1).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
            }.bind(this), false);

        document.getElementById(''+2).addEventListener('click', function(e) { 
                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
            }.bind(this), false);
    }
    

   CoverflowController.prototype.initOperators = function(objects, operators) {
        var groupid = 0;
        for (var i = 0; i < objects.length; i++) {
            var referenceObj = new THREE.Object3D();
            referenceObj.position.x = 1000*i;
            referenceObj.position.y = 0 //100+200*i;
            referenceObj.position.z = 0;
            referenceObj.rotation.x = 0;//Math.PI/2;
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
        
      FocusModel.instance.syncConnection.stateChange(obj);
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

    CoverflowController.prototype.transitionSwipe = function(e) {
        console.log(TouchDevice.currentX);
        console.log(this.view.camera.position.x);

        //inform others
        var obj = {data1:"transitionSwipe", data2:TouchDevice.currentX, data3:TouchDevice.currentY};
        syncConnection.stateChange(obj);

        //local swipe
        this.view.camera.position.x = (clientid-50)*500+(1280-TouchDevice.currentX)+10;
    }

    return CoverflowController;
})();
