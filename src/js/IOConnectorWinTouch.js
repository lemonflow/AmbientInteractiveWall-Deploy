//class with coverflow and operators

var IOConnectorWinTouch;
IOConnectorWinTouch = (function () {

    function IOConnectorWinTouch() {
        document.addEventListener('click', function(e) {
            e.preventDefault();
            document.getElementById('debugtxt').textContent = "clickevent";
            coverflow.objects[0].position.x = 2200;
         }.bind(this), false);

        document.addEventListener('touchstart', function(e) {
            e.preventDefault();
            document.getElementById('debugtxt').textContent = "touchevent"+JSON.stringify(e);
//            this.touchStarted(e);
        }, false);

//        document.body.addEventListener('touchmove', function(event) {
//            event.preventDefault();
//        }, false);
    }

    IOConnectorWinTouch.prototype.init = function () {
//        CoverFlow.objects[3].position.x = 2200;

    };

    IOConnectorWinTouch.prototype.touchStarted = function (event) {
        coverflow.objects[0].position.x = 200;

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