var MaterialCollection = (function () {
    "use strict";

    MaterialCollection.urls = [ 
        "img/px.jpg", "img/nx.jpg",
         "img/py.jpg", "img/ny.jpg",
        "img/pz.jpg", "img/nz.jpg" ];
    
    MaterialCollection.textureEnvBox =  THREE.ImageUtils.loadTextureCube( MaterialCollection.urls );
    
    function MaterialCollection() {
    }
    
    MaterialCollection.Blue = new THREE.MeshPhongMaterial( {
        color: 0x226699,
        //                envMap: textureEnvBox,
        transparent : true,
        combine: THREE.MultiplyOperation,
        reflectivity: 0.3,
        opacity :0.1,
        side : THREE.DoubleSide,
        wireframe: false
    } );
    
    
    MaterialCollection.Chrome= new THREE.MeshPhongMaterial( {
        color: 0xffffff,
        specular:0xffffff,
        envMap: MaterialCollection.textureEnvBox,
        combine: THREE.MultiplyOperation
    } );
    
    MaterialCollection.glass= new THREE.MeshBasicMaterial( {
        color: 0x000000,
        //                        envMap: textureEnvBox,
        opacity: 0.10,
        combine: THREE.MixOperation,
        reflectivity: 0.25,
        transparent: true,
        side : THREE.DoubleSide
    } ),
        
        MaterialCollection.glassInterior= new THREE.MeshBasicMaterial( {
        color: 0x000000,
        //                        envMap: textureEnvBox,
        opacity: 0.50,
        combine: THREE.MixOperation,
        reflectivity: 0.25,
        transparent: true,
        side : THREE.DoubleSide
    } ),
        
    MaterialCollection.sideglass= new THREE.MeshBasicMaterial( {
            color: 0x000000,
            //                        envMap: textureEnvBox,
            opacity: 0.01,
            combine: THREE.MixOperation,
            transparent: true,
            side : THREE.DoubleSide
        } );
    
    MaterialCollection.tire= new THREE.MeshLambertMaterial( {
        color: 0x000000,
        opacity: 0.1,
        combine: THREE.MixOperation,
        reflectivity: 0.25,
        transparent: true,
        side : THREE.DoubleSide
    } );
    
    MaterialCollection.interior= new THREE.MeshPhongMaterial( {
        color: 0x050505,
        shininess: 20
    } );
    
    MaterialCollection.black = new THREE.MeshLambertMaterial( {
        color: 0x000000,
         transparent: true,
         opacity: 0.5,
    } );
    
    MaterialCollection.cylBleu  = new THREE.MeshNormalMaterial( { 
        transparent: true,
        color: 0xEFEFEF, 
        opacity: 0.3
    });
    return MaterialCollection;
})();