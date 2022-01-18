// Class: CS 559
// Title: Assignment 4
// Name: Jacob Hawig
// Student ID: 9078102226

function setup() {
    var canvas = document.getElementById('myCanvas');
	canvas.width = window.innerWidth * 0.85;
	canvas.width = canvas.width;
	canvas.height = window.innerHeight;
    var context = canvas.getContext('2d');	
	let start = Date.now();
	let timer = setInterval(
	function() {
		let timePassed = Date.now() - start;
		if (timePassed >= 13940) {
			timePassed = timePassed % 13940;
		}
		draw(timePassed*0.001);
	}, 5);

    function draw(tParam) {
	canvas.width = canvas.width;
	function moveToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
	function drawBackground(color, Tx){
		context.beginPath();
		context.fillStyle = color;
		moveToTx([0,0], Tx);
		lineToTx([canvas.width,0],Tx);
		lineToTx([canvas.width,canvas.height],Tx);
		lineToTx([0,canvas.height],Tx);
		context.closePath();
		context.fill();
	}
	
	// Draws the RollerCoaster Cart
	function drawObject(color,Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-0.15,0],Tx);
	    lineToTx([-0.15,0.1],Tx);
	    lineToTx([0.1,0.1],Tx);
		lineToTx([0.1,0.15],Tx);
		lineToTx([0.15,0.15],Tx);
	    lineToTx([0.15,0],Tx);
	    context.closePath();
	    context.fill();
	}

	// These functions will be combined piecewise to makeup the roller coaster
	var C0 = function(t) {
        var x = t;
        var y = 1.5*t*t;
        return [x,y];
	}
	
	// The prime functions will be used for the rotation of the roller coaster cart
	var primeC0 = function(t){
		var x = 1;
		var y = 3*t;
		return [x,y];
	}

	var C1 = function(t) {
        var x = t;
        var y = 1.5*t*t-2*(t-1)*(t-1)*(t-1);
        return [x,y];
	}
	
	var primeC1 = function(t){
		var x = 1;
		var y = 3*t - 6*(t-1)*(t-1);
		return [x,y];
	}
	
	var C2 = function(t) {
		var x = t;
		var y = 12 * (t -3) * (t - 3);
		return [x,y];
	}
	
	var primeC2 = function(t){
		x = 1;
		y = 24 * (t-3);
		return [x,y];
	}
	
	var C3 = function(t) {
		var x = t;
		var y = 0;
		return [x,y];
	}
	
	var primeC3 = function(t){
		x = 1;
		y = 0;
		return [x,y];
	}
	
	var C4 = function(t) {
		var x = Math.cos(t-5.3) + ((t - 5.3) / 4) + 4;
		var y = Math.sin(t - 5.3) + 0.7857;
		return [x, y];
	}
	
	var primeC4 = function(t) {
		var x = 0.25 - Math.sin(t - 5.3);
		var y = Math.cos(t - 5.3);
		return [x,y];
	}
	
	var C5 = function(t) {
		var x = t-4.94;
		var y = 0;
		return [x,y];
	}
	
	var primeC5 = function(t){
		x = 1;
		y = 0;
		return [x,y];
	}
	
	var C6 = function(t) {
		var x = t-4.94;
		var y = (t-11.94)*(t-11.94)*(t-11.94);
		return [x,y];
	}
	
	var primeC6 = function(t){
		x = 1;
		y = 3*(t-11.94)*(t-11.94);
		return [x,y];
	}

	// The -12.94 addition to the Hermite function is to align the hermite with the end of the rollerCoaster
	// Ensures that the t values will align with previous functions
	var Hermite = function(t) {
	    return [2*(t-12.94)*(t-12.94)*(t-12.94)-3*(t-12.94)*(t-12.94)+1,
				(t-12.94)*(t-12.94)*(t-12.94)-2*(t-12.94)*(t-12.94)+(t-12.94),
				-2*(t-12.94)*(t-12.94)*(t-12.94)+3*(t-12.94)*(t-12.94),
				(t-12.94)*(t-12.94)*(t-12.94)-(t-12.94)*(t-12.94)];
	}

	var HermiteDerivative = function(t) {
            return [6*(t-12.94)*(t-12.94)-6*(t-12.94),
					3*(t-12.94)*(t-12.94)-4*(t-12.94)+1,
					-6*(t-12.94)*(t-12.94)+6*(t-12.94),
					3*(t-12.94)*(t-12.94)-2*(t-12.94)];
	}

	function Cubic(basis,P,t){
	    var b = basis(t);
	    var result=vec2.create();
	    vec2.scale(result,P[0],b[0]);
	    vec2.scaleAndAdd(result,result,P[1],b[1]);
	    vec2.scaleAndAdd(result,result,P[2],b[2]);
	    vec2.scaleAndAdd(result,result,P[3],b[3]);
	    return result;
	}
	
	var p0=[8,1];
	var d0=[1,5];
	var p1=[0,0];
	var d1=[0,-25];

	var points = [p0,d0,p1,d1];

	var hermite = function(t) {
		return Cubic(Hermite,points,t);
	}
	
	var prime_hermite = function(t) {
		return Cubic(HermiteDerivative,points,t);
	}

	// Generates the piecewise path that the rollercoaster cart will take
	// The curve is closed as the final hermite curve connects the beginning
	// and end of the curve.
	var rollerCoaster = function(t) {
        if(t<1) {
			return C0(t);
        }else if(t < 2.588){
			return C1(t);
        } else if(t < 3){
			return C2(t);
		} else if(t < 4.4){
			return C3(t);
		} else if(t < 9.35){
			return C4(t)
		} else if(t < 11.94){
			return C5(t);
		} else if(t < 12.94){
			return C6(t);
		} else{
			var param = t;
			return hermite(param);
		}
	}
	
	// Generates the angle at which the rollercoaster cart will rotate
	var rotationAngle = function(t) {
		if(t<1) {
			return primeC0(t);
        }else if (t < 2.588){
			return primeC1(t);
        } else if (t < 3){
			return primeC2(t);
		} else if(t < 4.4){
			return primeC3(t);
		} else if(t < 9.35){
			return primeC4(t);
		} else if(t < 11.94){
			return primeC5(t);
		} else if(t < 12.94){
			return primeC6(t);
		} else {
			var param = t;
			return prime_hermite(param);
		}
	}

	// Draws a given function
	function drawTrajectory(t_begin,t_end,intervals,C,Tx,color) {
	    context.strokeStyle=color;
		context.lineWidth = 5;
	    context.beginPath();
            moveToTx(C(t_begin),Tx);
            for(var i=1;i<=intervals;i++){
				var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
				lineToTx(C(t),Tx);
            }
            context.stroke();
	}
	
	
	var Tblue_to_canvas = mat3.create();
	drawBackground("#FFFEF2", Tblue_to_canvas);
	mat3.fromTranslation(Tblue_to_canvas, [canvas.width / 2, canvas.height / 2]);
	mat3.fromTranslation(Tblue_to_canvas,[35,canvas.height - 25]);
	mat3.scale(Tblue_to_canvas,Tblue_to_canvas,[150,-150]);
	
	// Drawing of the curve
	drawTrajectory(0,1.0,100,C0,Tblue_to_canvas,"red");
	drawTrajectory(1.0,2.588,100,C1,Tblue_to_canvas,"blue");
	drawTrajectory(2.588,3,100,C2,Tblue_to_canvas,"purple");
	drawTrajectory(3,4.4,100,C3,Tblue_to_canvas,"yellow");
	drawTrajectory(4.4,9.35,100,C4,Tblue_to_canvas,"black");
	drawTrajectory(9.35,11.94,100,C5,Tblue_to_canvas,"green");
	drawTrajectory(11.94,12.94,100,C6,Tblue_to_canvas,"orange");
	drawTrajectory(12.94,13.94,100,hermite,Tblue_to_canvas,"brown");
	
	// Drawing of the cart - translation and rotation
	var Tgreen_to_blue = mat3.create();
	mat3.fromTranslation(Tgreen_to_blue,rollerCoaster(tParam));
	var tangent = rotationAngle(tParam);
	var angle = Math.atan2(tangent[1],tangent[0]);
	mat3.rotate(Tgreen_to_blue,Tgreen_to_blue,angle);
	var Tgreen_to_canvas = mat3.create();
	mat3.multiply(Tgreen_to_canvas, Tblue_to_canvas, Tgreen_to_blue);
	drawObject("red",Tgreen_to_canvas);
    }
}
window.onload = setup;