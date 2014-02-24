//client
var clientid = getUrlVars()["id"]==undefined?50:getUrlVars()["id"];


//debug functions
document.getElementById(''+9).addEventListener('click', function(e) {
    location.reload(1);
    FocusModel.instance.syncConnection.stateChange({'reload':1}, e);
}.bind(this), false);

document.getElementsByTagName('html')[0].style.cursor = "visible";

//            if(clientid == 57) {
document.getElementById('menu').style.visibility = 'visible';
document.getElementsByTagName('html')[0].style.cursor = "auto";
//            }

var focusView = null;

var syncConnection = new SyncConnectionSocketIO();
syncConnection.startConnection();

window.scene = new THREE.Scene();
var w = 1280;
var h = 800;
var screenCount = 7;

var renderer = new THREE.WebGLRenderer({ clearColor: 0x232329, clearAlpha: 1, antialias: true });
renderer.autoClear = false;
renderer.setSize(w, h);
document.getElementById( 'container' ).appendChild( renderer.domElement );

//var background = new Background(clientid,renderer);
//background.init(); //own renderloop
//
////floorplan
//var ref6 = new FloorPlan(clientid, renderer);
//ref6.init(scene);
//ref6.controller.view = ref6;
//focusView= ref6;
//
////video
//var ref8 = new Main8(clientid, renderer);
//ref8.init(scene, 1024, w, h);
//ref8.controller.view = ref8;
//focusView= ref8;


//coverflow
var ref10 = new CoverFlow(clientid, renderer);
ref10.init(scene);
ref10.controller.view = ref10;
focusView = ref10;


//slideshow
//var ref11 = new SlideDeck(clientid, renderer);
//ref11.init(scene);
//ref11.controller.view = ref11;
//focusView = ref11;


//particles
//var ref9 = new Main9(clientid, renderer);
//ref9.init(scene, 1024, w, h);
//ref9.controller.view = ref9;
//focusView = ref9;


FocusModel.instance.activateFocus(focusView.controller); //main receives user input
//focusView.controller.controls = new THREE.TrackballControls(focusView.camera,  renderer.domElement);


//            document.getElementById(''+1).addEventListener('click', function(e) {
//                InputManager.getInstance().dispatchEvent(new InputEvent("prev"));
//            }.bind(this), false);
//
//                        if(clientid ==50) {
//                            var intervalID = window.setInterval(function() {
//                                InputManager.getInstance().dispatchEvent(new InputEvent("next"));
//                            },1000);
//                        }


(function renderloop() {
    renderer.render( scene, focusView.camera );
    TWEEN.update();
    if(focusView.needsContinuousUpdate) focusView.update();
    if(focusView.controller.needsContinuousUpdate) focusView.controller.update();
    requestAnimationFrame(renderloop);
})();