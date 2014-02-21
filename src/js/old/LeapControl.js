var controls;
var leapControls;
var fingers = {};

var currentLayerNumber = 0;
var currentHighlightedRegion = 0;

var currentGestureID;

var currentHandID;
var lastFrame = null;
//var resetVar = setInterval(function () {
//    resetScene()
//}, 1000);
var resetTimeSince1970 = new Date().getTime();
var lastGestureFrame = null;
var lastKeyTapGestureFrame = null;

function processGestures(frame) {

    if (frame.gestures) {
        if (0 < frame.gestures.length) {
            //for (var i = 0; i < frame.gestures.length; i++) {
            var gesture = frame.gestures[frame.gestures.length - 1];
            //console.log(gesture);
            if (gesture.type == "screentap") {
                console.log("screentap");
            } else if (gesture.type == "circle") {
                console.log("circle");
            } else if (gesture.type == "keyTap") {
                console.log("keyTap");
                foundKeyTap(frame);
            } else if (gesture.type == "swipe") {
                //console.log("swipe");
                //console.log(gesture.direction);

                if (currentGestureID != gesture.id && gesture.state == "stop") {

                    currentGestureID = gesture.id;

                    if (Math.abs(gesture.direction.y) < Math.abs(gesture.direction.x) && Math.abs(gesture.direction.z) < Math.abs(gesture.direction.x)) {
                        if (0 < gesture.direction.x) { //Right

                            foundSwipeGesture(frame, "right");
                        } else { //Left
                            foundSwipeGesture(frame, "left");
                        }
                    } else if (Math.abs(gesture.direction.x) < Math.abs(gesture.direction.y) && Math.abs(gesture.direction.z) < Math.abs(gesture.direction.y)) //Up / Down
                    {
                        if (0 < gesture.direction.y) //Up
                        {
                            foundSwipeGesture(frame, "up");
                        } else //Down
                        {
                            foundSwipeGesture(frame, "down");
                        }

                    } else if (Math.abs(gesture.direction.x) < Math.abs(gesture.direction.z) && Math.abs(gesture.direction.y) < Math.abs(gesture.direction.z)) //Push
                    {
                        if (0 > gesture.direction.z) //Push
                        {
                            foundSwipeGesture(frame, "push");
                        } else {
                            foundSwipeGesture(frame, "back");
                        }
                    }
                }

            }
            //}
        }
    }
}

function foundKeyTap(frame) {

    if (lastKeyTapGestureFrame) {
        var gestureTimeDifference = Math.abs(lastKeyTapGestureFrame.timestamp - frame.timestamp);
        //console.log(gestureTimeDifference);
        if (gestureTimeDifference < 90000) { //Wait X seconds before processing next swipe
            return;
        }
    }

    if (currentHighlightedRegion) {
        objects[7].material.opacity = 0;
        objects[8].material.opacity = 0;
        transition6();
    } else {
        objects[7].material.opacity = 0;
        objects[8].material.opacity = 0;
        transition7();
    }

    lastKeyTapGestureFrame = frame;
}

function foundSwipeGesture(frame, gestureName) {

    if (lastGestureFrame) {
        var gestureTimeDifference = Math.abs(lastGestureFrame.timestamp - frame.timestamp);
        //console.log(gestureTimeDifference);
        if (gestureTimeDifference < 50000) { //Wait X seconds before processing next swipe
            return;
        }
    }

    if (gestureName == "up") {
        console.log("Up Swipe");

        if (state == "state2" || state == "state3" || state == "state4") {
            transition0();
        }

    } else if (gestureName == "down") {
        console.log("Down Swipe");
    } else if (gestureName == "left") {
        console.log("Left Swipe");

        if (state == "state8") {
            transition1();
        }

    } else if (gestureName == "right") {
        console.log("Right Swipe");

        if (state == "state7") {
            transition1();
        }

    } else if (gestureName == "push") {
        console.log("Push Swipe");
        console.log("State = " + state);
        if (state == "state1") {
            transition1();

        } else if (state == "state2") {
            transition2();
        } else if (state == "state3") {
            transition3();
        } else if (state == "state2") {
            if (currentHighlightedRegion) {
                objects[7].material.opacity = 0;
                objects[8].material.opacity = 0;
                transition6();
            } else {
                objects[7].material.opacity = 0;
                objects[8].material.opacity = 0;
                transition7();
            }
        } else if (state == "state7") {
            transition8();
        } else if (state == "state9") {
            transition1();
        }


    } else if (gestureName == "back") {
        console.log("Back Swipe");
        console.log("State = " + state);
        if (state == "state3") {
            transition1();
        } else if (state == "state4") {
            transition2();
        } else if (state == "state2") {
            transition0();
        }
    }
    lastGestureFrame = frame;
}

function processHands(frame) {

    if (0 == frame.hands.length) return;

    var hand = frame.hands[0];
    if (currentHandID != hand.id) {
        currentHandID = hand.id;
        lastFrame = frame;
        return;
    }

    processHand(frame, hand);
}

function processHand(frame, hand) {

    if (!frame) return;
    if (!lastFrame) return;
    var frameTranslation = hand.translation(lastFrame);


    if (state == "state2") {

        //settled movement of the hand
        var targetZ = Math.max(700, Math.min(1100, camera.position.z + frameTranslation.z));
        new TWEEN.Tween(camera.position).to({
            z: targetZ
        }, Math.abs(frameTranslation.z) * 50).easing(TWEEN.Easing.Exponential.Out).start();
        //TODO --- reset camera back to 900 after timeout

        //fingertip of pointing finger
        var fingers = hand.pointables;
        if (fingers == undefined || fingers.length != 1) return;

        if (fingers[0].tipPosition.x < 0) {
            currentHighlightedRegion = 0;
        } else {
            currentHighlightedRegion = 1;
        }

        new TWEEN.Tween(objects[7].material).to({
            opacity: (fingers[0].tipPosition.x < 0 ? 1 : 0)
        }, 300).easing(TWEEN.Easing.Quadratic.Out).start();
        new TWEEN.Tween(objects[8].material).to({
            opacity: (fingers[0].tipPosition.x > 0 ? 1 : 0)
        }, 300).easing(TWEEN.Easing.Quadratic.Out).start();

    } else if (state == "state1") {

        //camera.position.x += frameTranslation.x * -10.0;
        camera.position.z += frameTranslation.y * -10.0;
        camera.position.z = Math.max(220, Math.min(1300, camera.position.z));
        //console.log(camera.position.z);

        //camera.position.z += frameTranslation.z * -10.0;
    }
}



function updateLeapFrame(frame) {

    if (frame.valid == false) {
        return;
    }

    processGestures(frame);
    processHands(frame);

    lastFrame = frame;
}



//resetTimeSince1970 = new Date().getTime();
/*
                    var zCameraRange = 500;
                    if (1800 - zCameraRange > camera.position) {
                        camera.position.z = 1800 - zCameraRange; 
                    }else if (1800 + zCameraRange < camera.position) {
                        camera.position.z = 1800 + zCameraRange;
                    } 
                    */


function resetScene() {
    var d = new Date();
    var timeDifference = Math.abs(d.getTime() - resetTimeSince1970);

    //console.log(timeDifference);

    if (10000 < timeDifference) {
        transition0();
        resetTimeSince1970 = new Date().getTime();
    }
}


function updateSelectedLayer(layerNumber) {

    currentLayerNumber = layerNumber;

    if (currentLayerNumber < 0) {
        currentLayerNumber = 0;
    } else if (objects.length >= currentLayerNumber) {
        currentLayerNumber = objects.length - 1;
    }

    //state

    if (state == "state1") {
        transition1();
    } else if (state == "state2") {
        transition2();
    } else if (state === "state3") {
        transition3();
    }

    //console.log(layerNumber);
}