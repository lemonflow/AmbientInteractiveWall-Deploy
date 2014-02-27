//class with coverflow and operators

var IOConnectorTouch;
IOConnectorTouch = (function () {
    var pressDownTime = 0;
    var pressDuration = 0;
    var lastTouchTime = 0;
    var currentTime = 0;

    //tuning
    var minPressDuration = 90;



    function IOConnectorTouch() {
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



    IOConnectorTouch.prototype.init = function () {
//        CoverFlow.objects[3].position.x = 2200;

    };

    IOConnectorTouch.prototype.findCurrentTouchIndex = function(id) {
        for (var i=0; i < TouchDevice.currentTouches.length; i++) {
            if (TouchDevice.currentTouches[i].id === id) {
                return i;
            }
        }
        return -1;
    };

    IOConnectorTouch.prototype.touchStarted = function (event) {
        //-2560 until -1280


        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];

            TouchDevice.currentTouches.push({
                id: touch.identifier,
                startX: touch.pageX,
                startY: touch.pageY,
                pageX: touch.pageX,
                pageY: touch.pageY
            });
            TouchDevice.startX = touch.pageX;
            TouchDevice.startY = touch.pageY;
            TouchDevice.currentX = touch.pageX;
            TouchDevice.currentY = touch.pageY;

        }

        InputManager.getInstance().routeFromInputDevice(new Event('touchSwipeStart'));
        document.getElementById('debugtxt').textContent = "add "+ touch.identifier+"@"+touch.pageX;
        pressDownTime = new Date().getTime();

    };

    IOConnectorTouch.prototype.touchMoved = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = this.findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch = TouchDevice.currentTouches[currentTouchIndex];
                currentTouch.pageX = touch.pageX;
                currentTouch.pageY = touch.pageY;

                TouchDevice.currentTouches.splice(currentTouchIndex, 1, currentTouch);

//                document.getElementById('debugtxt').textContent = "move"+currentTouch.startX;

                TouchDevice.currentX = touch.pageX;
                TouchDevice.currentY = touch.pageY;

                InputManager.getInstance().routeFromInputDevice(new Event('touchSwipeMove'));
            }
        }
    };

    IOConnectorTouch.prototype.touchEnded = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            var currentTouchIndex = this.findCurrentTouchIndex(touch.identifier);

            if (currentTouchIndex >= 0) {
                var currentTouch =  TouchDevice.currentTouches[currentTouchIndex];
                TouchDevice.currentTouches.splice(currentTouchIndex, 1);
                TouchDevice.currentX = touch.pageX;
                TouchDevice.currentY = touch.pageY;

//                document.getElementById('debugtxt').textContent = "remove "+currentTouchIndex;

                currentTime = new Date().getTime();
                if(currentTime-lastTouchTime<250) return;
                lastTouchTime = currentTime;

                pressDuration = (currentTime - pressDownTime);
                if(pressDuration>minPressDuration) {
                    InputManager.getInstance().routeFromInputDevice(new Event('touchSwipeEnd'));
                    InputManager.getInstance().routeFromInputDevice(new Event('touchEnd'));
                }

                document.getElementById('debugtxt').textContent = "press Duration "+pressDuration;
            }
        }
    };

    return IOConnectorTouch;
})();