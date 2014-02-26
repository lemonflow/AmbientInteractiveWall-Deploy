//client
var clientid = getUrlVars()["id"]==undefined?50:getUrlVars()["id"];


//debug functions
document.getElementById(''+9).addEventListener('click', function(e) {
    location.reload(1);
    FocusModel.instance.syncConnection.stateChange({'reload': 1});
}.bind(this), false);

document.getElementsByTagName('html')[0].style.cursor = "visible";

//            if(clientid == 57) {
document.getElementById('menu').style.visibility = 'visible';
document.getElementsByTagName('html')[0].style.cursor = "auto";
//            }

var focusView = null;

var syncConnection = new SyncConnectionSocketIO();
syncConnection.startConnection();

var ioTouch = new IOConnectorTouch();
ioTouch.init();

window.scene = new THREE.Scene();
var w = 1280;
var h = 800;
var screenCount = 7;

var renderer = new THREE.WebGLRenderer({ clearColor: 0x232329, clearAlpha: 1, antialias: true });
renderer.autoClear = false;
renderer.setSize(w, h);
//renderer.sortObjects = false;
document.getElementById( 'container' ).appendChild( renderer.domElement );

//var background = new Background(clientid,renderer);
//background.init(); //own renderloop
//
////video
//var ref8 = new Video(clientid, renderer);
//ref8.init(scene, 1024, w, h);
//ref8.controller.view = ref8;
//focusView= ref8;

//TextAnimation
//var ref5 = new Main5(clientid, renderer);
//ref5.init(scene);
//ref5.controller.view = ref5;
//focusView = ref5;


//coverflow
var coverflow = new CoverFlow(clientid, renderer);
coverflow.init(scene);
coverflow.controller.view = coverflow;


////floorplan
var floorPlan = new FloorPlan(clientid, renderer);
floorPlan.init(scene);
floorPlan.controller.view = floorPlan;


//slideshow
var slideDeck = new SlideDeck(clientid, renderer);
slideDeck.init(scene);
slideDeck.controller.view = slideDeck;

focusView= slideDeck;

//particles
//var ref9 = new Main9(clientid, renderer);
//ref9.init(scene, 1024, w, h);
//ref9.controller.view = ref9;
//focusView = ref9;

if(focusView != null && focusView.hasOwnProperty("controller"))
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
    renderer.render( scene, FocusModel.instance.focusController.view.camera );
    TWEEN.update();
    if(focusView.needsContinuousUpdate) focusView.update();
    if(focusView.controller.needsContinuousUpdate) focusView.controller.update();
    requestAnimationFrame(renderloop);
})();