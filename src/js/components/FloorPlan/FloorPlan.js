var FloorPlan = (function () {
    var renderer;

    var fullWidth =  window.innerWidth
    var fullHeight = window.innerHeight;
    
    function FloorPlan(idx, r) {
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
        
        this.controller = new FloorPlanController(this);
    }
    
    FloorPlan.prototype.init = function(scene) {
        console.log(this);
        console.log("_______init Floorplan");

        this.camera = new THREE.OrthographicCamera( 75, w / h, 1, 10000 );
        var offsetX = (clientid-50)*w;
        this.camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );

        this.camera.position.x = 0;
        this.camera.position.z = 521;
        
        for (var i = 0; i < Main6Data.length; i++) {
            var texture, material, plane;
            var item = Main6Data[i];
            texture = THREE.ImageUtils.loadTexture( "assets/" + item[1] );
            material = new THREE.MeshBasicMaterial({ map : texture, transparent:true, side: THREE.DoubleSide });
//            material.opacity = (i%3==0)?0.9:0;
            plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 450), material);
            plane.position.y = 0;
            plane.rotation.x = 0;
            scene.add(plane);
            this.objects.push(plane);
        }
        
        //controller 
        this.controller.initOperators(this.objects, this.operators);
        this.controller.initController(document);
        this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
//        this.controller.transition0();
    };
    
    return FloorPlan;
})();