var camera, scene;
var rendererMain, renderer;
var geometry, material, mesh;

var sceneWebGL;

var objects = [];
var objectSide = {};
var objectSide2 = {};

var cursorObjects =[];

var operators = {
    overviewLayout: [],
    sphere: [],
    helix: [],
    grid: []
};


var w = 192*2;
var h = 108*2;
var screenCount = 2;
var fullWidth = screenCount * w;
var fullHeight = h;


init();
animate();
transition0();


function init() {
    camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
    //camera = new THREE.PerspectiveCamera( 30, fullWidth / fullHeight, 1, 10000 );
    
  var offsetX = (clientid-50)*w;
    console.log("offset"+clientid);
  camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
    

    var directionalLight = new THREE.DirectionalLight(0xffffff, 0.5);
    directionalLight.position.set(0, 5, 0);
    
    scene = new THREE.Scene(); // CSS Transform Scene
    sceneWebGL = new THREE.Scene(); //WebGL Scee
    sceneWebGL.add(directionalLight);
    
    
    for (var i = 0; i < data.length; i++) {
        var texture, material, plane;
        var item = data[i];
        texture = THREE.ImageUtils.loadTexture( "assets/" + item[1] );
        material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        material.opacity = (i%3==0)?0.9:0;
        plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
        plane.doubleSided = true;
        plane.position.y = 0;
        sceneWebGL.add(plane);
        objects.push(plane);
    }
    
    //cursor
    {
         var texture, material, plane;
        texture = THREE.ImageUtils.loadTexture( "assets/cursor.png" );
        material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
        plane.doubleSided = true;        
//        sceneWebGL.add(plane);
    }

    //side panels
    //room available
    {
        var texture, material, plane;
        texture = THREE.ImageUtils.loadTexture( "assets/room_available.png" );
        material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        material.opacity = 0.0;
        plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 376), material);
        plane.doubleSided = true;        
        sceneWebGL.add(plane);
        plane.position.x = 600;
        plane.rotation.x = -0.13;
        plane.rotation.y = 0.1;
        
        objectSide = plane;
    }
    
    //group
    {
        var texture, material, plane;
        texture = THREE.ImageUtils.loadTexture( "assets/team_overview.png" );
        material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        material.opacity = 0.0;
        plane = new THREE.Mesh(new THREE.PlaneGeometry(500, 376), material);
        plane.doubleSided = true;        
        sceneWebGL.add(plane);
        plane.position.x = -600;
        plane.rotation.x = 0.13;
        plane.rotation.y = -0.1;
        
        objectSide2 = plane;
    }
    

    // html panel
    var element	= document.createElement('iframe')
    element.src	= 'http://mrdoob.github.io/three.js/examples/webgl_postprocessing.html';
	element.style.width = '500px';
	element.style.height = '500px';
    var object = new THREE.CSS3DObject(element);
    object.position.x = 600;
     object.position.z = 1000;
    scene.add(object);
    
    
    var element	= document.createElement('iframe')
      element.src	= 'http://p5p.cecinestpasparis.net/sketches/p5p.html?sketch=line/quellebruit/quellebruit.pde&lib=line/_plib/line.pde&title=Quelle%20Bruit!';

	element.style.width = '500px';
	element.style.height = '500px';
    var object = new THREE.CSS3DObject(element);
    object.position.x = -600;
    object.position.z = 1000;
    scene.add(object);
    
    var element	= document.createElement('iframe')
  element.src	= ' http://mbrdna.com';
	element.style.width = '1024px';
	element.style.height = '500px';
    var object = new THREE.CSS3DObject(element);
    object.position.x = -300;
    object.position.y = 600;
    object.position.z = 1000;
    scene.add(object);

    var element	= document.createElement('iframe')
    element.src	= 'http://lemonflow.github.io/hackinghamsters/';
	element.style.width = '500px';
	element.style.height = '500px';
    var object = new THREE.CSS3DObject(element);
    object.position.x = 600;
    object.position.y = 600;
    object.position.z = 1000;
    scene.add(object);

    
    renderer = new THREE.CSS3DRenderer();
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.domElement.style.position = 'absolute';
    renderer.domElement.style.top = 0;
    document.getElementById('container').appendChild(renderer.domElement);

    rendererMain = new THREE.WebGLRenderer({ clearColor: 0x232329, clearAlpha: 1, antialias: true });
    rendererMain.setSize(w, h);
	rendererMain.domElement.style.position	= 'absolute';
	rendererMain.domElement.style.top	= 0;
	rendererMain.domElement.style.zIndex	= 1;
	renderer.domElement.appendChild( rendererMain.domElement );
        
//   container.textContent = window.innerWidth+" "+window.innerHeight;

    initOperators();
    initController(document);
}

function animate() {
    requestAnimationFrame(animate);
    TWEEN.update();
    controls.update();
}

function render() {
    rendererMain.render(sceneWebGL, camera);
    if(state == "state9") renderer.render(scene, camera);
}