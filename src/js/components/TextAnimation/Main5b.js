var Main5b = (function () {
    var renderer;
    var camera;
    
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var fullWidth =  window.innerWidth
    var fullHeight = window.innerHeight;
    
    //scene
    var object, uniforms, attributes;
    var text = "------",
        height = 15, 
        size = 120,
        curveSegments = 2,
        steps = 40,
        bevelThickness = 5,
        bevelSize = 1.5,
        bevelSegments = 2,
        bevelEnabled = true,
        font = "helvetiker", 		// helvetiker, optimer, gentilis, droid sans, droid serif
        weight = "bold",		// normal bold
        style = "normal";		// normal italic
    
    
    function Main5b(idx,r) {
        this.id = idx;
        fullWidth = screenCount*w;
        fullHeight = h;
        renderer = r;
        
        this.needsContinuousUpdate = true;
        this.controller = new Main5Controller(this);
    }
    
    Main5b.prototype.init = function(scene) {
        this.camera = new THREE.PerspectiveCamera( 30, w / h, 1, 10000 );
        this.camera.position.x = 0; this.camera.position.y = 0; this.camera.position.z = 400;
        var offsetX = (clientid-50)*w;
        this.camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
        
        attributes = {
            displacement: {	type: 'v3', value: [] },
            customColor: {	type: 'c', value: [] }
        };
        uniforms = {
            amplitude: { type: "f", value: 5.0 },
            opacity:   { type: "f", value: 0.3 },
            color:     { type: "c", value: new THREE.Color( 0xff0000 ) }
        };
        
        var shaderMaterial = new THREE.ShaderMaterial( {
            uniforms:       uniforms,
            attributes:     attributes,
            vertexShader:   document.getElementById( 'vs_lines' ).textContent,
            fragmentShader: document.getElementById( 'fs_lines' ).textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
        
        shaderMaterial.linewidth = 1;
        
        geometry = new THREE.TextGeometry( text, {
            size: size,
            height: height,
            curveSegments: curveSegments,
            font: font,
            weight: weight,
            style: style,
            bevelThickness: bevelThickness,
            bevelSize: bevelSize,
            bevelEnabled: bevelEnabled,
            bevelSegments: bevelSegments,
            steps: steps
        });
        
        geometry.dynamic = true;
        THREE.GeometryUtils.center( geometry );
        object = new THREE.Line( geometry, shaderMaterial, THREE.LineStrip );
        var vertices = object.geometry.vertices;
        var displacement = attributes.displacement.value;
        var color = attributes.customColor.value;
        
        for( var v = 0; v < vertices.length; v ++ ) {
            displacement[ v ] = new THREE.Vector3();
            color[ v ] = new THREE.Color( 0xffffff );
            color[ v ].setHSL( v / vertices.length, 0.5, 0.5 );
        }
        
        object.rotation.x = 0.2;
        scene.add( object );
        
    };
    
    Main5b.prototype.update = function() {
        var time = Date.now() * 0.01;
        object.rotation.y = 0.25 * time;
        uniforms.amplitude.value = 0.5;// * Math.sin( 0.5 * time );
        uniforms.color.value.offsetHSL( 0.0005, 0, 0 );
        var nx, ny, nz, value;
        for( var i = 0, il = attributes.displacement.value.length; i < il; i ++ ) {
            nx = 1.9 * ( 0.5 - Math.random() );
            ny = 1.9 * ( 0.5 - Math.random() );
            nz= 0;
//            ny = 0.3 * ( 0.5 - Math.random() );
//            nz = 0.3 * ( 0.5 - Math.random() );
            
            value = attributes.displacement.value[ i ];
            value.x += nx;
            value.y += ny;
            value.z += nz;
        }
        
        attributes.displacement.needsUpdate = true;
        renderer.render( scene, camera );
    };
    
    Main5b.prototype.transition1 = function() {
    }
    
    return Main5b;
    
})();