var Main8 = (function () {
    var camera;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    
    var video, texture, material, mesh;
  
    
    function Main8(idx, r) {
        this.id = idx;
        this.camera = null;
        this.objects = [];
        this.operators = {};
        this.needsContinuousUpdate = true;
        
        renderer = r;
        fullWidth = screenCount*w;
        fullHeight = h;
        
        this.controller = new Main8Controller(this);
    }
    
    Main8.prototype.init = function(scene) {
        camera = new THREE.PerspectiveCamera( 40, w / h, 1, 10000 );
        camera.position.z = 510;
        var offsetX = (clientid-50)*w;
        camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
        this.camera = camera;
        
        var light = new THREE.DirectionalLight( 0xEFEFFF );
        light.position.set( 0.5, 1, 1 ).normalize();
        scene.add(light);
        
        video = document.getElementById( 'video' );
        
        texture = new THREE.Texture( video );
        texture.minFilter = THREE.LinearFilter;
        texture.magFilter = THREE.LinearFilter;
        texture.format = THREE.RGBFormat;
        texture.generateMipmaps = false;
        
        var parameters = { color: 0xffffff, map: texture };
        var material_base = new THREE.MeshLambertMaterial( parameters );
        renderer.initMaterial( material_base, scene.__lights, scene.fog );
        
        mesh = new THREE.Mesh( new THREE.CubeGeometry( 1280, 400, 1 ), material_base );
        mesh.position.x =  0;
        mesh.position.y =  0;
        mesh.position.z = 0;
        mesh.scale.x = mesh.scale.y = mesh.scale.z = 0.25;
        scene.add( mesh );
        this.objects.push(mesh);
        
//        renderer.autoClear = true;
        
        //controller stuff
        this.controller.initOperators(this.objects, this.operators);
        this.controller.initController(document);
    };
    
    
    Main8.prototype.update = function() {
        if ( video.readyState === video.HAVE_ENOUGH_DATA ) {
            if ( texture ) texture.needsUpdate = true;
        }
    };
    
    return Main8;
})();