// Class: CS 559
// Title: Assignment 5
// Name: Jacob Hawig
// Student ID: 9078102226

function setup() {
    var observerCanvas = document.getElementById('observerCanvas');
    var cameraCanvas = document.getElementById('cameraCanvas');
    var observerContext = observerCanvas.getContext('2d');
    var cameraContext = cameraCanvas.getContext('2d');
    var context = cameraContext; // default to drawing in the camera window

	let start = Date.now();
	let timer = setInterval(
	function() {
		let timePassed_tParam = Date.now() - start;
		let timePassed_viewAngle = Date.now() - start;
		if (timePassed_tParam >= 6000) {
			timePassed_tParam = timePassed_tParam % 6000;
		}
		if (timePassed_viewAngle >= 6000){
			timePassed_viewAngle = timePassed_viewAngle % 6000;
		}
		draw(timePassed_tParam*0.001, timePassed_viewAngle*0.001);
	}, 5);

    function draw(tParam, viewAngle) {
      
    // clear both canvas instances
	observerCanvas.width = observerCanvas.width;
	cameraCanvas.width = cameraCanvas.width;
     
	function moveToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec3.create(); vec3.transformMat4(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
	function drawObject(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-.25,-.35,0],Tx);
		lineToTx([-.10,-.20,0],Tx);
		lineToTx([-.10,-.20,0.2],Tx);
		lineToTx([-.10,0.20,0.2],Tx);
		lineToTx([-.10,0.20,0],Tx);
	    lineToTx([-.25,.35,0],Tx);
		lineToTx([-.25,.35,0.2],Tx);
		lineToTx([0.15,0.15,0.2],Tx);
        lineToTx([.15,.15,0],Tx);
      	lineToTx([.25,0,0],Tx);
		lineToTx([0.25,0,0.2],Tx);
		lineToTx([0.15,-.15,0.2],Tx);
	    lineToTx([.15,-.15,0],Tx);
	    context.closePath();
	    context.fill();
	}
	
    function drawCamera(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);
        context.beginPath();
	    context.strokeStyle = color;
        // Twelve edges of a cropped pyramid
        moveToTx([-3,-3,-2],Tx);lineToTx([3,-3,-2],Tx);
        lineToTx([3,3,-2],Tx);lineToTx([-3,3,-2],Tx);
        moveToTx([3,-3,-2],Tx);lineToTx([2,-2,0],Tx);
        lineToTx([2,2,0],Tx);lineToTx([3,3,-2],Tx);
        moveToTx([2,-2,0],Tx);lineToTx([-2,-2,0],Tx);
        lineToTx([-2,2,0],Tx);lineToTx([2,2,0],Tx);
        moveToTx([-2,-2,0],Tx);lineToTx([-3,-3,-2],Tx);
        lineToTx([-3,3,-2],Tx);lineToTx([-2,2,0],Tx);
        context.stroke();
    }
      
    function draw3DAxes(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);

        context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
	    // Arrowheads
	    moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
	    moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
      	moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
	    // X-label
	    moveToTx([1.3,-.05,0],Tx);lineToTx([1.4,.05,0],Tx);
	    moveToTx([1.3,.05,0],Tx);lineToTx([1.4,-.05,0],Tx);
        // Y-label
        moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.35,0],Tx);lineToTx([.05,1.4,0],Tx);
        moveToTx([0,1.35,0],Tx);lineToTx([0,1.28,0],Tx);
	    // Z-label
	    moveToTx([-.05,0,1.3],Tx);
	    lineToTx([.05,0,1.3],Tx);
	    lineToTx([-.05,0,1.4],Tx);
	    lineToTx([.05,0,1.4],Tx);

	    context.stroke();
	}

    function drawUVWAxes(color,TxU,scale) {
        var Tx = mat4.clone(TxU);
        mat4.scale(Tx,Tx,[scale,scale,scale]);

        context.strokeStyle=color;
	    context.beginPath();
	    // Axes
	    moveToTx([1.2,0,0],Tx);lineToTx([0,0,0],Tx);lineToTx([0,1.2,0],Tx);
        moveToTx([0,0,0],Tx);lineToTx([0,0,1.2],Tx);
	    // Arrowheads
	    moveToTx([1.1,.05,0],Tx);lineToTx([1.2,0,0],Tx);lineToTx([1.1,-.05,0],Tx);
	    moveToTx([.05,1.1,0],Tx);lineToTx([0,1.2,0],Tx);lineToTx([-.05,1.1,0],Tx);
      	moveToTx([.05,0,1.1],Tx);lineToTx([0,0,1.2],Tx);lineToTx([-.05,0,1.1],Tx);
	    // U-label
        moveToTx([1.3,.05,0],Tx);lineToTx([1.3,-.035,0],Tx);lineToTx([1.35,-.05,0],Tx);
        lineToTx([1.4,-.035,0],Tx);lineToTx([1.4,.05,0],Tx);
        // V-label
        moveToTx([-.05,1.4,0],Tx);lineToTx([0,1.3,0],Tx);lineToTx([.05,1.4,0],Tx);
	    // W-label
	    moveToTx([-.1,0,1.3],Tx);lineToTx([-.05,0,1.4],Tx);lineToTx([-0,0,1.3],Tx);
	    lineToTx([.05,0,1.4],Tx);lineToTx([.1,0,1.3],Tx);

	    context.stroke();
	}

    function drawUpVector(color,vecUp,Tx) {
	    context.strokeStyle=color;
	    context.beginPath();
	    // A single line segment in the "up" direction
	    moveToTx([0,0,0],Tx);
        lineToTx(vecUp,Tx);
	    context.stroke();
    }
    var Hermite = function(t) {
	    return [
		2*t*t*t-3*t*t+1,
		t*t*t-2*t*t+t,
		-2*t*t*t+3*t*t,
		t*t*t-t*t
	    ];
	}

    var HermiteDerivative = function(t) {
        return [
        6*t*t-6*t,
        3*t*t-4*t+1,
        -6*t*t+6*t,
        3*t*t-2*t
        ];
    }

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec3.create();
	    vec3.scale(result,P[0],b[0]);
	    vec3.scaleAndAdd(result,result,P[1],b[1]);
	    vec3.scaleAndAdd(result,result,P[2],b[2]);
	    vec3.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}
	
	var p0=[0,-300,150];
	var d0=[220,300,0];
	var p1=[170,-50,-150];
	var d1=[-100,30,0];
	var p2=[200,200,-85];
	var d2=[90,300,0];
	var neg_p1 = [-175,-100,-150];
	var neg_p2 = [-225,200,0];
	var p3=[0,350,150];
	var d3 = [-150,300,0];
	var d4 = [-250,185,0];

	var P0 = [p0,d0,p1,d1]; // First two points and tangents
	var P1 = [p1,d1,p2,d2]; // Last two points and tangents
	var P2 = [neg_p1,d1,p0,d0];
	var P3 = [neg_p2,d2,neg_p1,d1];
	var P4 = [p2,d2,p3,d3];
	var P5 = [p3,d4,neg_p2,d2];

	var C0 = function(t_) {return Cubic(Hermite,P0,t_);};
	var C1 = function(t_) {return Cubic(Hermite,P1,t_);};
	var C2 = function(t_) {return Cubic(Hermite,P2,t_);};
	var C3 = function(t_) {return Cubic(Hermite,P3,t_);};
	var C4 = function(t_) {return Cubic(Hermite,P4,t_);};
	var C5 = function(t_) {return Cubic(Hermite,P5,t_);};

	var C0prime = function(t_) {return Cubic(HermiteDerivative,P0,t_);};
	var C1prime = function(t_) {return Cubic(HermiteDerivative,P1,t_);};
	var C2prime = function(t_) {return Cubic(HermiteDerivative,P2,t_);};
	var C3prime = function(t_) {return Cubic(HermiteDerivative,P3,t_);};
	var C4prime = function(t_) {return Cubic(HermiteDerivative,P4,t_);};
	var C5prime = function(t_) {return Cubic(HermiteDerivative,P5,t_);};
      
    var Ccomp = function(t) {
        if (t<1){
            var u = t;
            return C0(u);
        } else if(t < 2){
            var u = t-1.0;
            return C1(u);
        } else if(t < 3){
			var u = t-2.0;
			return C4(u);
		} else if(t < 4){
			var u = t-3.0;
			return C5(u);
		} else if(t < 5){
			var u = t-4.0;
			return C3(u);
		} else if(t < 6){
			var u = t-5.0;
			return C2(u);
		}
	}

    var Ccomp_tangent = function(t) {
        if (t<1){
            var u = t;
            return C0prime(u);
        } else if(t < 2){
            var u = t-1.0;
            return C1prime(u);
        } else if(t < 3){
			var u = t - 2.0;
			return C4prime(u);
		} else if(t < 4.0){
			var u = 4.0-t;
			return C5prime(u);
		} else if(t < 5.0){
			var u = 5.0-t;
			return C3prime(u);
		} else if(t < 6.0){
			var u = 6.0-t;
			return C2prime(u);
		}         
	}
	
	var uptwirl = function(t) {
        var x = 2 * t*Math.sin(t);
		var z = 2 * t;
		var y = 2 * t*Math.cos(t);
        return [x,y,z];
	}
	
	var prime_twirl = function(t){
		var x = 2 * Math.cos(t);
		var z = 2;
		var y = -2 * Math.sin(t);
		return [x,y,z];
	}
	
	var to_a_point = function(t){
        var x = Math.sin(t) * coeff ** (-1 * t / 10);
		var y = Math.cos(t) * coeff ** (-1 * t / 20);
		var z = t;
        return [x,y,z];	
	}
	
	var helix = function(t){
        var x = -1*15*Math.cos(t);
		var y = -1*15*Math.sin(t);
		var z = -1*15*t;
        return [x,y,z];	
	}
	
	var reverse_helix = function(t){
		var x = -1*15*Math.cos(t);
		var y = 1*15*Math.sin(t);
		var z = -1*15*t + Math.PI;
		return [x, y, z];
	}

    var CameraCurve = function(angle) {
        var distance = 240.0;
        var eye = vec3.create();
        eye[0] = distance*Math.sin(viewAngle);
        eye[1] = 50;
        eye[2] = distance*Math.cos(viewAngle);  
        return [eye[0],eye[1],eye[2]];
    }

    function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
	    context.beginPath();
        moveToTx(C(t_begin),Tx);
        for(var i=1;i<=intervals;i++){
            var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
            lineToTx(C(t),Tx);
        }
        context.stroke();
	}

    // create two lookAt transforms; one for the camera
    // and one for the "external observer"

    // Create Camera (lookAt) transform
    var eyeCamera = CameraCurve(viewAngle);
    var targetCamera = vec3.fromValues(0,0,0); // Aim at the origin of the world coords
    var upCamera = vec3.fromValues(0,100,0); // Y-axis of world coords to be vertical
	var TlookAtCamera = mat4.create();
    mat4.lookAt(TlookAtCamera, eyeCamera, targetCamera, upCamera);
      
    // Create Camera (lookAt) transform
    var eyeObserver = vec3.fromValues(500,300,500);
    var targetObserver = vec3.fromValues(0,50,0); // Observer still looks at origin
    var upObserver = vec3.fromValues(0,1,0); // Y-axis of world coords to be vertical
	var TlookAtObserver = mat4.create();
    mat4.lookAt(TlookAtObserver, eyeObserver, targetObserver, upObserver);
      
    // Create ViewPort transform (assumed the same for both canvas instances)
    var Tviewport = mat4.create();
	mat4.fromTranslation(Tviewport,[200,300,0]);  // Move the center of the
                                                  // "lookAt" transform (where
                                                  // the camera points) to the
                                                  // canvas coordinates (200,300)
	mat4.scale(Tviewport,Tviewport,[100,-100,1]); // Flip the Y-axis,
                                                  // scale everything by 100x
    // make sure you understand these    

    context = cameraContext;

    // Create Camera projection transform
    // (orthographic for now)
    var TprojectionCamera = mat4.create();
    mat4.ortho(TprojectionCamera,-180,180,-180,180,-1,1);
    //mat4.perspective(TprojectionCamera,Math.PI/4,1,-1,1); // Use for perspective teaser!

    // Create Observer projection transform
    // (orthographic for now)
    var TprojectionObserver = mat4.create();
    mat4.ortho(TprojectionObserver,-240,240,-240,240,-1,1);
     
    // Create transform t_VP_PROJ_CAM that incorporates
    // Viewport, projection and camera transforms
    var tVP_PROJ_VIEW_Camera = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Camera,Tviewport,TprojectionCamera);
    mat4.multiply(tVP_PROJ_VIEW_Camera,tVP_PROJ_VIEW_Camera,TlookAtCamera);
    var tVP_PROJ_VIEW_Observer = mat4.create();
    mat4.multiply(tVP_PROJ_VIEW_Observer,Tviewport,TprojectionObserver);
    mat4.multiply(tVP_PROJ_VIEW_Observer,tVP_PROJ_VIEW_Observer,TlookAtObserver);
      
	// Create model(ing) transform
    // (from moving object to world)
    var Tmodel = mat4.create();
	mat4.fromTranslation(Tmodel,Ccomp(tParam));
    var tangent = Ccomp_tangent(tParam);
    var angle = Math.atan2(tangent[1],tangent[0]);
	mat4.rotateZ(Tmodel,Tmodel,angle);

    // Create transform t_VP_PROJ_VIEW_MOD that incorporates
    // Viewport, projection, camera, and modeling transform
    var tVP_PROJ_VIEW_MOD_Camera = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD_Camera, tVP_PROJ_VIEW_Camera, Tmodel);
    var tVP_PROJ_VIEW_MOD1_Observer = mat4.create();
	mat4.multiply(tVP_PROJ_VIEW_MOD1_Observer, tVP_PROJ_VIEW_Observer, Tmodel);
    var tVP_PROJ_VIEW_MOD2_Observer = mat4.create();
    mat4.translate(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_Observer, eyeCamera);
	var TlookFromCamera = mat4.create();
    mat4.invert(TlookFromCamera,TlookAtCamera);
    mat4.multiply(tVP_PROJ_VIEW_MOD2_Observer, tVP_PROJ_VIEW_MOD2_Observer, TlookFromCamera);

    // Draw the following in the Camera window
    context = cameraContext;
	draw3DAxes("grey",tVP_PROJ_VIEW_Camera,100.0);
    // drawUpVector("orange",upCamera,tVP_PROJ_VIEW_Camera,1.0);
	drawTrajectory(0.0,1.0,100,C0,tVP_PROJ_VIEW_Camera,"red");
    drawTrajectory(0.0,1.0,100,C1,tVP_PROJ_VIEW_Camera,"blue");
	drawTrajectory(0.0,1.0,100,C2,tVP_PROJ_VIEW_Camera,"blue");
    drawTrajectory(0.0,1.0,100,C3,tVP_PROJ_VIEW_Camera,"red");
	drawTrajectory(0.0,1.0,100,C4,tVP_PROJ_VIEW_Camera,"red");
    drawTrajectory(0.0,1.0,100,C5,tVP_PROJ_VIEW_Camera,"blue");
	drawTrajectory(0.0,60,400, uptwirl, tVP_PROJ_VIEW_Camera, "purple");
	drawTrajectory(0.0, 30, 300, helix, tVP_PROJ_VIEW_Camera, "blue");
	drawTrajectory(0.0, 30, 300, reverse_helix, tVP_PROJ_VIEW_Camera, "red");
    // draw3DAxes("green", tVP_PROJ_VIEW_MOD_Camera,100.0); // Uncomment to see "model" coords
    drawObject("green",tVP_PROJ_VIEW_MOD_Camera,100.0);
      
    // Draw the following in the Observer window
    context = observerContext;
	draw3DAxes("grey",tVP_PROJ_VIEW_Observer,100.0);  
    // drawUpVector("orange",upCamera,tVP_PROJ_VIEW_Observer,1.0);
    drawTrajectory(0.0,1.0,100,C0,tVP_PROJ_VIEW_Observer,"red");
    drawTrajectory(0.0,1.0,100,C1,tVP_PROJ_VIEW_Observer,"blue");
	drawTrajectory(0.0,1.0,100,C2,tVP_PROJ_VIEW_Observer,"blue");
    drawTrajectory(0.0,1.0,100,C3,tVP_PROJ_VIEW_Observer,"red");
	drawTrajectory(0.0,1.0,100,C4,tVP_PROJ_VIEW_Observer,"red");
    drawTrajectory(0.0,1.0,100,C5,tVP_PROJ_VIEW_Observer,"blue");
	drawTrajectory(0.0,60,400, uptwirl, tVP_PROJ_VIEW_Observer, "purple");
	drawTrajectory(0.0, 30, 300, helix, tVP_PROJ_VIEW_Observer, "blue");
	drawTrajectory(0.0, 30, 300, reverse_helix, tVP_PROJ_VIEW_Observer, "red");
    drawObject("green",tVP_PROJ_VIEW_MOD1_Observer,100.0);     
    drawCamera("green",tVP_PROJ_VIEW_MOD2_Observer,10.0); 
	drawUVWAxes("green",tVP_PROJ_VIEW_MOD2_Observer,100.0);  
    }
    draw();
}
window.onload = setup;