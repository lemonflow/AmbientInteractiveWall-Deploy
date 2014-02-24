 //class with coverflow and operators

 var CoverFlow;
 CoverFlow = (function () {
     var renderer;
     var camera;

     var windowHalfX = window.innerWidth / 2;
     var windowHalfY = window.innerHeight / 2;
     var fullWidth = window.innerWidth
     var fullHeight = window.innerHeight;

     function Main10(idx, r) {
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
         fullWidth = screenCount * w;
         fullHeight = h;

         this.controller = new Main10Controller();
     }

     Main10.prototype.init = function (scene) {
         camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
         //        camera.position.x = 0; camera.position.y = -700; camera.position.z = 600;
         //        camera.position.x = -200; camera.position.y = 0; camera.position.z = 400;
         var offsetX = (clientid - 50) * w;
         camera.setViewOffset(fullWidth, fullHeight, offsetX, 0, w, h);
         this.camera = camera;

         for (var i = 0; i < Main10Data.length; i++) {
             var texture, material, plane;
             var item = Main10Data[i];
             texture = THREE.ImageUtils.loadTexture("assets/" + item[1]);
             material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
             material.opacity = (i == 0) ? 0.9 : 0;
             plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 500), material);
             plane.doubleSided = true;
             plane.position.y = 0;
             plane.rotation.x = Math.PI / 2;
             scene.add(plane);
             this.objects.push(plane);
         }

         //controller stuff
         this.controller.initOperators(this.objects, this.operators);
         this.controller.initController(document);
         this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
     };

     return Main10;
 })();