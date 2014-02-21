var Main6 = (function () {
    var renderer;
    var camera;
    
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var fullWidth =  window.innerWidth
    var fullHeight = window.innerHeight;
    
    function Main6(idx, r) {
        this.id = idx;
        this.camera = null;
        this.objects = [];
        this.objectSide = {};
        this.objectSide2 = {};
        this.operators = {
            overviewLayout: [],
            sphere: [],
            helix: [],
            grid: []
        };
        this.needsContinuousUpdate = false;
        
        renderer = r;
        fullWidth = screenCount*w;
        fullHeight = h;
        
        this.controller = new Main6Controller(this);
    }
    
    Main6.prototype.init = function(scene) {
        this.camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000 );
        var offsetX = (clientid-50)*w;
        this.camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
        this.camera.position.x = 0; this.camera.position.y = -700; this.camera.position.z = 600;
        
        for (var i = 0; i < Main6Data.length; i++) {
            var texture, material, plane;
            var item = Main6Data[i];
            texture = THREE.ImageUtils.loadTexture( "assets/" + item[1] );
            material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
            material.opacity = (i%3==0)?0.9:0;
            plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
            plane.doubleSided = true;
            plane.position.y = 0;
            plane.rotation.x = Math.PI/2;
            scene.add(plane);
            this.objects.push(plane);
        }
        
        //controller 
        this.controller.initOperators(this.objects, this.operators);
        this.controller.initController(document);
        this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
//        this.controller.transition0();
    };
    
    return Main6;
})();