//class with coverflow and operators

var IOConnectorWinTouch;
IOConnectorWinTouch = (function () {

    function IOConnectorWinTouch() {
        document.body.addEventListener('touchstart', function(e) {
            e.preventDefault();
            this.touchStarted(event);
        }, false);

//        document.body.addEventListener('touchmove', function(event) {
//            event.preventDefault();
//        }, false);
    }

    IOConnectorWinTouch.prototype.init = function () {
        CoverFlow.objects[3].position.x = 200;

    };

    IOConnectorWinTouch.prototype.touchStarted = function (event) {
        var touches = event.changedTouches;

        for (var i=0; i < touches.length; i++) {
            var touch = touches[i];
            console.log(touch.pageX);
//            var touchColor = randomColor();
//
//            currentTouches.push({
//                id: touch.identifier,
//                pageX: touch.pageX,
//                pageY: touch.pageY,
//                color: touchColor
//            });

//            ctx.beginPath();
//            ctx.arc(touch.pageX, touch.pageY, 2.5, Math.PI*2, false);
//            ctx.fillStyle = touchColor;
//            ctx.fill();
        }
    };

    return IOConnectorWinTouch;
})();