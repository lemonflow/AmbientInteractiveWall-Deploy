/* Post Processing Render Composer */


// Question. How to deal with blurring on alpha channel?
// 1. triangle blur 2. hv blur;
// 2. Save. again opacity needs work.

function PostComposer( width, height, renderer, scene, camera ) {

	// motion blur
	var renderTarget, renderTargetParameters;
	var renderComposer;

	// render target
	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBFormat, stencilBuffer: false };
	renderTarget = new THREE.WebGLRenderTarget( width, height, renderTargetParameters );

	// composer
	renderComposer = new THREE.EffectComposer( renderer, renderTarget );

//	var renderSource = new THREE.RenderPass( scene, camera );
//	renderSource.clearColor = new THREE.Color( 0x000000 );
//	renderSource.clearAlpha = 1;

	var effectSave = new THREE.SavePass( new THREE.WebGLRenderTarget( width, height, renderTargetParameters ) );
	var effectBlend = new THREE.ShaderPass( THREE.ShaderExtras[ "blend" ], "tDiffuse1" );

	effectBlend.uniforms[ 'tDiffuse2' ].texture = effectSave.renderTarget;
	effectBlend.uniforms[ 'mixRatio' ].value = 0.95;

	effectBlend.renderToScreen = true;

//	renderComposer.addPass( renderSource );
	renderComposer.addPass( effectSave );
	renderComposer.addPass( effectBlend );

	this.render = function() {

		// renderer.clear();
		// renderer.clearTarget( renderTarget );
		renderComposer.render();

	};

	this.setPersistance = function(mix) {
		effectBlend.uniforms[ 'mixRatio' ].value = mix;
	}



}




// function PostComposer( width, height, renderer, scene, camera ) {

// 	var renderTarget, renderTargetParameters;
// 	var renderComposer;

// 	// render target
// 	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
// 	renderTarget = new THREE.WebGLRenderTarget( width, height, renderTargetParameters );

// 	// composer
// 	renderComposer = new THREE.EffectComposer( renderer, renderTarget );

// 	var renderSource = new THREE.RenderPass( scene, camera );

// 	var effectBlurX = new THREE.ShaderPass( THREE.ShaderExtras[ "horizontalBlur" ] );
// 	var effectBlurY = new THREE.ShaderPass( THREE.ShaderExtras[ "verticalBlur" ] );

// 	// renderSource.clearColor = new THREE.Color( 0x000000 );
// 	// renderSource.clearAlpha = 0;

// 	var bluriness = 3;
// 	var blurAmountX = bluriness / width;
// 	var blurAmountY = bluriness / height;

// 	effectBlurX.uniforms[ 'h' ].value = blurAmountX;
// 	effectBlurY.uniforms[ 'v' ].value = blurAmountY;

// 	effectBlurY.renderToScreen = true;

// 	renderComposer.addPass( renderSource );
// 	renderComposer.addPass( effectBlurX );
// 	renderComposer.addPass( effectBlurY );

// 	this.render = function() {

// 		// renderer.clear();
// 		renderer.clearTarget( renderTarget );
// 		renderComposer.render();

// 	};

// 	this.changeBlur = function(bluriness) {
// 		blurAmountX = bluriness / width;
// 		blurAmountY = bluriness / height;

// 		effectBlurX.uniforms[ 'h' ].value = blurAmountX;
// 		effectBlurY.uniforms[ 'v' ].value = blurAmountY;
// 	}


// }


// function PostComposer( width, height, renderer, scene, camera ) {

// 	var renderTarget, renderTargetParameters;
// 	var renderComposer;

// 	// render target
// 	renderTargetParameters = { minFilter: THREE.LinearFilter, magFilter: THREE.LinearFilter, format: THREE.RGBAFormat, stencilBuffer: false };
// 	renderTarget = new THREE.WebGLRenderTarget( width, height, renderTargetParameters );

// 	// composer
// 	renderComposer = new THREE.EffectComposer( renderer, renderTarget );

// 	var renderSource = new THREE.RenderPass( scene, camera );

// 	var blurShader = THREE.ShaderExtras[ "triangleBlur" ];
// 	var effectBlurX = new THREE.ShaderPass( blurShader, 'texture' );
// 	var effectBlurY = new THREE.ShaderPass( blurShader, 'texture' );

// 	// renderSource.clearColor = new THREE.Color( 0x000000 );
// 	// renderSource.clearAlpha = 0;

// 	var bluriness = 3;
// 	var blurAmountX = bluriness / width;
// 	var blurAmountY = bluriness / height;

// 	effectBlurX.uniforms[ 'delta' ].value = new THREE.Vector2( blurAmountX, 0 );
// 	effectBlurY.uniforms[ 'delta' ].value = new THREE.Vector2( 0, blurAmountY );

// 	effectBlurY.renderToScreen = true;

// 	renderComposer.addPass( renderSource );
// 	renderComposer.addPass( effectBlurX );
// 	renderComposer.addPass( effectBlurY );

// 	this.render = function() {

// 		// renderer.clear();
// 		renderer.clearTarget( renderTarget );
// 		renderComposer.render();

// 	};

// 	this.changeBlur = function(bluriness) {
// 		blurAmountX = bluriness / width;
// 		blurAmountY = bluriness / height;

// 		effectBlurX.uniforms[ 'delta' ].value = new THREE.Vector2( blurAmountX, 0 );
// 		effectBlurY.uniforms[ 'delta' ].value = new THREE.Vector2( 0, blurAmountY );
// 	}


// }