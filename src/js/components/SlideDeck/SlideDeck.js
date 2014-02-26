var SlideDeck = (function () {
    var renderer;
    var camera;
    
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var fullWidth =  window.innerWidth;
    var fullHeight = window.innerHeight;
    
    function SlideDeck(idx, r) {
        this.id = idx;
        this.camera = null;
        this.objects = [];
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
        
        this.controller = new SlideDeckController();
    }
    
    SlideDeck.prototype.init = function(scene) {
        console.log(this);
        console.log("_______init SlideDeck");


        camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000 );
        var offsetX = (clientid-50)*w;
        camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
        this.camera = camera;
        this.camera.position.x = 10;
        this.camera.position.x = 10;
        this.camera.position.z = 900;
        
        for (var i = 0; i < SlideDeckData.length; i++) {
            var texture, material, plane;
            var item = SlideDeckData[i];
            texture = THREE.ImageUtils.loadTexture( "assets/" + item[1] );
            material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
            material.opacity = (i==0)?1:0;
            plane = new THREE.Mesh(new THREE.PlaneGeometry(8960, 800), material);
            plane.doubleSided = true;
            plane.position.y = 0;
            plane.rotation.x = 0;//Math.PI / 2;
            scene.add(plane);
            this.objects.push(plane);
        }
        
        //controller stuff
//        this.controller.initOperators(this.objects, this.operators);
        this.controller.initController(document);
//        this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
    };
    
    return SlideDeck;
})();