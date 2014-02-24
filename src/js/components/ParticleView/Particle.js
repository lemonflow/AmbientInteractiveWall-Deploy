var Main9 = (function () {
    //    var camera;
    var windowHalfX = window.innerWidth / 2;
    var windowHalfY = window.innerHeight / 2;
    var fullWidth = window.innerWidth;
    var fullHeight = window.innerHeight;
    
    //    var video, texture, material, mesh;
    var camera, scene, renderer, shadowCamera;
    var effectsComposer, particles;
    
    var directionalLight, shadowPlane;
    var planeTest;
    
    var gl, cameraRTT, sceneRTTPos;
    var rtTexturePos, rtTexturePos2, positionShader, generatedTexturePos, textureColor;
    var fboParticles;
    
    var textureWidth = 256; // 64 128 256 512 1024
    
    var resizeCanvas = document.createElement('canvas');
    var resizeCtx = resizeCanvas.getContext('2d');
    
    var panelWidth = 100;
    var panelHeight = 100;
    
    
    function Main9(idx, r) {
        this.id = idx;
        this.camera = null;
        this.objects = [];
        this.operators = {};
        this.needsContinuousUpdate = true;
        this.renderer = renderer = r;
        
        fullWidth = screenCount*w;
        fullHeight = h;
        
        this.controller = new Main9Controller(this);
    }
    
    Main9.prototype.init = function(s, size, w, h) {
        
        //controller stuff
        this.controller.initOperators(this.objects, this.operators);
        this.controller.initController(document);
        this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
           
        
//        camera = new THREE.PerspectiveCamera( 75, w / h, 1, 10000 );
        
        
        if (size) textureWidth = parseInt(size, 0);

        scene = s;
        panelWidth = w;
        panelHeight = h;
        
        camera = new THREE.PerspectiveCamera( 70, w / h, 1, 100000 );
        camera.position.x = 0;
        camera.position.y = 0;
        camera.position.z = 2000;
        var offsetX = (clientid-50)*w;
        camera.setViewOffset( fullWidth, fullHeight, offsetX, 0, w, h );
        this.camera = camera;
        scene.add( camera );
        
        shadowCamera = new THREE.PerspectiveCamera( 70, w / h, 1, 100000 );
        shadowCamera.position.z = 500 + 500;
        scene.add( shadowCamera );
        
        var blank = THREE.ImageUtils.generateDataTexture(1,1, new THREE.Color());
        
        planeTest = new THREE.Mesh(
            new THREE.PlaneGeometry(1000, 1000, 2, 2),
            new THREE.MeshBasicMaterial({ color: 0x121212, map: blank})
        );
        planeTest.rotation.x = Math.PI / 2;
        planeTest.position.z = -500;
       
        planeTest.visible = false;
        scene.add( planeTest );
        
        
        
        
        
        var texture = THREE.ImageUtils.loadTexture( "assets/217_images1.png");
        var material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
        material.opacity = 0.0;
        var plane = new THREE.Mesh(new THREE.PlaneGeometry(2000, 1000), material);
        plane.doubleSided = true;
        plane.rotation.x = Math.PI / 2;
        plane.position.z = -300;
        scene.add(plane);
        
        for (var i = 0; i < SlideDeckData.length; i++) {
            var texture, material, plane;
            var item = SlideDeckData[i];
            texture = THREE.ImageUtils.loadTexture( "assets/" + item[1] );
            material = new THREE.MeshBasicMaterial({ map : texture, transparent:true });
            material.opacity = (i==0)?0:0;
            plane = new THREE.Mesh(new THREE.PlaneGeometry(8960, 800), material);
            plane.doubleSided = true;
            plane.position.y = 0;
            plane.rotation.x =  Math.PI / 2;
             plane.position.z = -161;
            scene.add(plane);
            this.objects.push(plane);
        }
        
        
        effectsComposer = new PostComposer(w, h, renderer, scene, shadowCamera);
        
        this.initRTT();
        
        // Particles
        var sprite = this.generateSprite() ;
        texture = new THREE.Texture( sprite );
        texture.needsUpdate = true;
        
        var attributes = {
            size: {    type: 'f', value: [] },
            customColor: { type: 'c', value: [] },
            aPoints: { type: 'v2', value: [] },
        };
        
        var uniforms = {
            baseOpacity:    { type: "f", value: 1.0 },
//             color:     { type: "c", value: new THREE.Color(0xffffff) },
            position_texture:   { type: "t", value: 0, texture: rtTexturePos },
            particle_texture:   { type: "t", value: 1, texture: texture },
            color_texture: { type: "t", value: 2, texture: null },
            next_color_texture:  { type: "t", value: 3, texture: null },
            photoDimensions: { type: "v2", value: new THREE.Vector2(1,1) },
            fboWidth: { type: "f", value: textureWidth },
            afterEffects: { type: "i", value: 0 },  //0-Normal, 1-XPro, 2-Vintage
            transition: { type: "f", value: 0.0 } //
        };
        
        var shaderMaterial = new THREE.ShaderMaterial({
            uniforms:       uniforms,
            attributes:     attributes,
            vertexShader:   document.getElementById('particles_vertex').textContent.replace(/==PHOTOSHOP==/g, photoshopMath),
            fragmentShader: document.getElementById('particles_fragment').textContent,
            blending:       THREE.AdditiveBlending,
            depthTest:      false,
            transparent:    true
        });
        
        var geometry = new THREE.Geometry();
        var particleCount = textureWidth * textureWidth;
        for (var i = 0; i < particleCount; i++) {
            geometry.vertices.push(new THREE.Vector3());
        }
        
        particles = new THREE.ParticleSystem(geometry, shaderMaterial);
        
        var w = resizeCanvas.width, h = resizeCanvas.height, wh = w * h;
        var resizeData = resizeCtx.getImageData(0, 0, w, h).data;
        
        var i;
        
        textureColor = this.generateTextureColor(resizeData);
        uniforms.color_texture.texture = textureColor;
        
        var square = textureWidth;
        var textureCoords = [], d = 1 / square;
        for (var y = d / 2; y < 1; y += d) {
            for (var x = d / 2; x < 1; x += d) {
                textureCoords.push(new THREE.Vector2(x, y));
            }
        }
        attributes.aPoints.value = textureCoords;
        scene.add(particles);
        
        //init the simulation and tweening
        start = Date.now();
        last = start;
        explode = true;
        this.controller.initController();
    }
    
    Main9.prototype.initRTT= function() {
        gl = renderer.getContext();
        
        if( !gl.getExtension( "OES_texture_float" )) {
            alert( "No OES_texture_float support for float textures!" );
            return;
        }
        
        if( gl.getParameter(gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS) == 0) {
            alert( "No support for vertex shader textures!" );
            return;
        }
        
        cameraRTT = new THREE.OrthographicCamera(-textureWidth/2, textureWidth/2, textureWidth/2, -textureWidth/2, -1000000, 1000000);
        cameraRTT.position.z = 100;
        
        generatedTexturePos = this.generateTexturePos();
        
        rtTexturePos = new THREE.WebGLRenderTarget(textureWidth, textureWidth, {
            wrapS:THREE.RepeatWrapping,
            wrapT:THREE.RepeatWrapping,
            minFilter: THREE.NearestFilter,
            magFilter: THREE.NearestFilter,
            format: THREE.RGBAFormat,
            type:THREE.FloatType,
            stencilBuffer: false
        });
        
        rtTexturePos2 = rtTexturePos.clone();
        
        var simulation_shader = document.getElementById('texture_fragment_simulation_shader').textContent;
        simulation_shader = simulation_shader.replace(/==NOISE==/g, 
                                                      optimized_noise);
        
        positionShader = new THREE.ShaderMaterial({
            uniforms: {
                time: { type: "f", value: -1 },
                delta: { type: "f", value: 0 },
                tPositions: { type: "t", value: 0, texture: generatedTexturePos },
                tPositions2: { type: "t", value: 1, texture: generatedTexturePos },
                implode: { type: "i", value: 0 },
                home: { type: "i", value: 0 },
                photoTexture: { type: "t", value: 3, texture: null },
                photoDimensions: { type: "v2", value: new THREE.Vector2(1,1) },
                fboWidth: { type: "f", value: textureWidth },
                transition: { type: "f", value: 0 },
                explosionType: { type: "i", value: 0 } //0-Noise Wave, 1-Orb Attractors, 2-Orb Repellers 3-Air Brakes, 4-Plain, 5-Sphere, 6-Cone,7-Supershape
            },
            
            vertexShader: document.getElementById('texture_vertex_simulation_shader').textContent,
            fragmentShader: simulation_shader
            
        });
        
        window.positionShader = positionShader;
        
        sceneRTTPos = new THREE.Scene();
        sceneRTTPos.add(cameraRTT);
        
        var plane = new THREE.PlaneGeometry(textureWidth, textureWidth);
        quad = new THREE.Mesh(plane, positionShader);
        quad.rotation.x = Math.PI / 2;
        quad.position.z = -5000;
        sceneRTTPos.add(quad);
        
        fboParticles = new THREE.FBOUtils( textureWidth, renderer );
        fboParticles.pushDataToTexture(generatedTexturePos, rtTexturePos);
        fboParticles.renderToTexture(rtTexturePos, rtTexturePos2);
        
        // Set textured to FBOs
        positionShader.uniforms.tPositions.texture = rtTexturePos;
        positionShader.uniforms.tPositions2.texture = rtTexturePos2;
        //
        generatedTexturePos = rtTexturePos.clone();
        fboParticles.renderToTexture(rtTexturePos, generatedTexturePos);
        return;
    }
    
    
//    Main9.prototype.loadTexture = function( url, mapping, onLoad, onError ) {
////        var texture = new THREE.Texture( undefined, mapping );
////        var loader = new THREE.ImageLoader();
////        loader.addEventListener( 'load', function ( event ) {
////            texture.image = event.content;
////            texture.needsUpdate = true;
////            if ( onLoad ) onLoad( texture );
////        } );
////        
////        loader.addEventListener( 'error', function ( event ) {
////            if ( onError ) onError( event.message );
////        } );
////        loader.load( url );
////        return texture;
//    }
    
    Main9.prototype.assignTextureMap = function (texture) {
        planeTest.scale.x = texture.image.width / texture.image.height;
        planeTest.material.map = texture;
        planeTest.visible = false;
        
        positionShader.uniforms['photoTexture'].texture = texture;
        positionShader.uniforms['photoDimensions'].value = new THREE.Vector2(texture.image.width, texture.image.height);
        
        particles.material.uniforms['next_color_texture'].texture = texture;
        particles.material.uniforms.photoDimensions.value = positionShader.uniforms['photoDimensions'].value;
        
    }
    
    
    
    /***** Data Generation Methods ********/
    
    Main9.prototype.generateTexturePos = function() {
        var n = textureWidth * textureWidth;
        var positions = [];
        var x, y, z;
        var w = resizeCanvas.width, h = resizeCanvas.height;
        
        for (var k = 0; k < n; k++) {
            x = k % w - w / 2;
            y = h / 2 - Math.floor( k / w );
            z = 0;
            positions.push(x, y, z, 1.0);
        }
        return THREE.FBOUtils.createTextureFromData(textureWidth, textureWidth, positions);
    }
    
    
    Main9.prototype.generateTextureColor = function ( resizeData ) {
        var n = textureWidth * textureWidth;
        var colors = [];
        var w = resizeCanvas.width, h = resizeCanvas.height;
        var wh = w * h;
        for (var k = 0; k < n; k++) {
            if (k < wh) {
                colors.push(
                    resizeData[k * 4] / 255,
                    resizeData[k * 4 + 1] / 255,
                    resizeData[k * 4 + 2] / 255,
                    resizeData[k * 4 + 3] / 255
                );			
            } else {
                colors.push( 0, 0, 0, 0 );
            }
        }
        return THREE.FBOUtils.createTextureFromData(textureWidth, textureWidth, colors);
    }
    
    Main9.prototype.generateSprite = function() {
        // Generate a texture
        var canvas = document.createElement( 'canvas' );
        canvas.width = 128;
        canvas.height = 128;
        
        var context = canvas.getContext( '2d' );
        
        context.beginPath();
        context.arc( 64, 64, 60, 0, Math.PI * 2, false) ;
        context.closePath();
        
        context.lineWidth = 0.5; //0.05
        context.stroke();
        context.restore();
        
        var gradient = context.createRadialGradient( canvas.width / 2, canvas.height / 2, 0, canvas.width / 2, canvas.height / 2, canvas.width / 2 );
        
        gradient.addColorStop( 0, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.2, 'rgba(255,255,255,1)' );
        gradient.addColorStop( 0.4, 'rgba(200,200,200,1)' );
        gradient.addColorStop( 1, 'rgba(0,0,0,1)' );
        
        context.fillStyle = gradient;
        
        context.fill();
        
        return canvas;
    }
    
    //_______________
    
    Main9.prototype.update = function () {
        var now = Date.now();
        
        particles.material.uniforms['baseOpacity'].value = 1;
        
        if (startExplodingTime) {
            var implosionLapse = (now - startExplodingTime) / 1000;
            var transition;
            if (implosionLapse <= DURATION_ANIMATION_SOLID) {
                transition = implosionLapse / DURATION_ANIMATION_SOLID;
            } else {
                transition = 0;
            }
            
            particles.material.uniforms['transition'].value = transition;
            positionShader.uniforms['transition'].value = transition;
            
            var elapsed = (now - startExplodingTime) / 1000;
            if (elapsed <= TIME_FOR_FADING) {
//                 particles.material.uniforms.baseOpacity.value = 1-(elapsed / TIME_FOR_FADING)*0.7;
//                 planeTest.material.opacity = 1 - (elapsed / TIME_FOR_FADING);
            }
        }
        
        //advance the simulation
        lapsed = now - last;
        last = now;
        
        if (explode) {
            positionShader.uniforms.delta.value = lapsed / 1000;
            positionShader.uniforms.time.value = (now - start) / 1000;
            positionShader.uniforms.implode.value = implode ? 1 : 0;
            positionShader.uniforms.home.value = home ? 1 : 0;
            renderer.render(sceneRTTPos, cameraRTT, positionShader.uniforms.tPositions.texture, false);
            
            if (!home) {
                // ping-pong swap
                var tmp = positionShader.uniforms.tPositions.texture;
                positionShader.uniforms.tPositions.texture = positionShader.uniforms.tPositions2.texture;
                positionShader.uniforms.tPositions2.texture = tmp;
                particles.material.uniforms.position_texture.texture = positionShader.uniforms.tPositions.texture;
            }
        }
    }
    
    //------
    
    var last = Date.now(), start = Date.now();
    var explode = false;
    var implode = false;
    var home = false;
    
    var startExplodingTime;	
    var timeoutExplosion;
    var savedState ;
    var DURATION_ANIMATION_SOLID = 2;
    var DURATION_ANIMATION_FLUID = 3 + 2;
    var TIME_FOR_FADING = 3+2;
    
    
    Main9.prototype.gohome = function () {
        home = !home;
        if (home) {
            savedState = positionShader.uniforms.tPositions2.texture;
        } else {
            positionShader.uniforms.tPositions2.texture = positionShader.uniforms.tPositions.texture;
            renderer.render(sceneRTTPos, cameraRTT, savedState, false);
            positionShader.uniforms.tPositions2.texture = savedState;
        }
    }
    
    Main9.prototype.simulationTrigger = function(texture) {
        // Show original picture for a while.
        startExplodingTime = Date.now();
        if (!home) this.gohome();
        
        if (timeoutExplosion) {
            clearTimeout(timeoutExplosion);
        }
        
        implode = true;
        
        setTimeout(function() {
            implode = false;
            renderer.deallocateTexture( particles.material.uniforms.color_texture.texture );
            particles.material.uniforms['color_texture'].texture = texture;
        }, 1000 * DURATION_ANIMATION_SOLID);
        
        var self = this;
        timeoutExplosion = setTimeout(function() {
            if (home) {
                self.gohome();
            }
        }, 1000 * DURATION_ANIMATION_FLUID);
    }
    
    
    return Main9;
})();

