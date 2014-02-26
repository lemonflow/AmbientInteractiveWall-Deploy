//class with coverflow and operators

var IOConnectorWinTouch;
IOConnectorWinTouch = (function () {
    var currentTouches = new Array;
    var pressDownTime = 0;
    var pressDuration = 0;
    var lastTouchTime = 0;
    var currentTime = 0;



    function IOConnectorWinTouch() {
//        document.addEventListener('click', function(e) {
//            e.preventDefault();
//            document.getElementById('debugtxt').textContent = "clickevent";
//            coverflow.objects[0].position.x = 2200;
//         }.bind(this), false);

        document.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.touchStarted(e);
        }.bind(this), false);

        document.addEventListener('touchmove', function(e) {
            e.preventDefault();
            this.touchMoved(e);
        }.bind(this), false);

        document.addEventListener('touchend', function(e) {
            e.preventDefault();
            this.touchEnded(e);
        }.bind(this), false);

        document.addEventListener('touchleave', function(e) {
            e.preventDefault();
            this.touchEnded(e);
        }.bind(this), false);
    }



    IOConnectorWinTouch.prototype.init = function () {
//        CoverFlow.objects[3].position.x = 2200;

    };

    IOConnectorWinTouch.prototype.findCurrentTouchIndex = function(id) {
        for (var i=0; i < currentTouches.length; i++) {
            if (currentTouches[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    IOConnectorWinTouch.prototype.touchStarted = function (event) {
        //-2560 until -1280


        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];

            currentTouches.push({
                id: touch.identifier,
                startX: touch.pageX,
                startY: touch.pageY,
                pageX: touch.pageX,
                pageY: touch.pageY
            });
        }

        InputManager.getInstance().routeFromInputDevice(new Event('touchStart'));
        //direct call:
//        FocusModel.instance.focusController.touchDown(touch.pageX);
        document.getElementById('debugtxt').textContent = "add "+ touch.identifier+"@"+touch.pageX;
        pressDownTime = new Date().getTime();

    };

    IOConnectorWinTouch.prototype.touchMoved = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = this.findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = currentTouches[currentTouchIndex];
                currentTouch.pageX = touch.pageX;
                currentTouch.pageY = touch.pageY;
                currentTouches.splice(currentTouchIndex, 1, currentTouch);

                document.getElementById('debugtxt').textContent = "move"+currentTouch.startX;
                FocusModel.instance.focusController.touchMove(touch.pageX);
            }
        }
    };

    IOConnectorWinTouch.prototype.touchEnded = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = this.findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = currentTouches[currentTouchIndex];
                currentTouches.splice(currentTouchIndex, 1);
//                document.getElementById('debugtxt').textContent = "remove "+currentTouchIndex;

                currentTime = new Date().getTime();
                if(currentTime-lastTouchTime<250) return;
                lastTouchTime = currentTime;

                pressDuration = (currentTime - pressDownTime);
                if(pressDuration>50) {
                    InputManager.getInstance().routeFromInputDevice(new Event('touchEnd'));
//                    FocusModel.instance.focusController.touchUp(touch.pageX);
                }

                document.getElementById('debugtxt').textContent = "press Duration "+pressDuration;
            }
        }
    };

    return IOConnectorWinTouch;
})();