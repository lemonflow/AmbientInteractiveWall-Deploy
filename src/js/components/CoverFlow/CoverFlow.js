 //class with coverflow and operators

 var CoverFlow;
 CoverFlow = (function () {
     var renderer;
     var camera;

     var fullWidth = window.innerWidth
     var fullHeight = window.innerHeight;

     function CoverFlow(idx, r) {
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

         this.controller = new CoverflowController();
     }

     CoverFlow.prototype.init = function (scene) {
         camera = new THREE.PerspectiveCamera(75, w / h, 1, 10000);
         var offsetX = (clientid - 50) * w;
         camera.setViewOffset(fullWidth, fullHeight, offsetX, 0, w, h);
         this.camera = camera;

         for (var i = 0; i < CoverflowData.length; i++) {
             var texture, material, plane;
             var item = CoverflowData[i];
             texture = THREE.ImageUtils.loadTexture("assets/" + item[1]);
             material = new THREE.MeshBasicMaterial({ map: texture, transparent: true });
             material.opacity = (i == 0) ? 0.9 : 0;
             plane = new THREE.Mesh(new THREE.PlaneGeometry(1000, 500), material);
             plane.doubleSided = true;
             plane.position.y = 0;
             plane.rotation.x = 0;//Math.PI / 2;
             scene.add(plane);
             this.objects.push(plane);
         }

         //controller stuff
         this.controller.initOperators(this.objects, this.operators);
         this.controller.initController(document);
         this.controller.layout(this.operators.overviewLayout, 2000, this.objects);
     };

     return CoverFlow;
 })();