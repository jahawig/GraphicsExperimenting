// Class: CS 559
// Title: Assignment 3
// Name: Jacob Hawig
// Student ID: 9078102226

function setup() {
    var canvas = document.getElementById('myCanvas2');
	canvas.width = window.innerWidth * 0.85;
	canvas.width = canvas.width;
	canvas.height = window.innerHeight;
    var context = canvas.getContext('2d');
	var button1 = document.getElementById('button1');
	var click_count = 0;

    function draw() {
	canvas.width = canvas.width;
	
	function moveToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.moveTo(res[0],res[1]);}

	function lineToTx(loc,Tx)
	{var res=vec2.create(); vec2.transformMat3(res,loc,Tx); context.lineTo(res[0],res[1]);}
	
	function drawSpaceShip(color,Tx) {
	    context.beginPath();
	    context.fillStyle = color;
	    moveToTx([-10,-35],Tx);
		lineToTx([-2,-15],Tx);
		lineToTx([-2,15],Tx);
	    lineToTx([-10,35],Tx);
        lineToTx([10,10],Tx);
      	lineToTx([30,0],Tx); // point
	    lineToTx([10,-10],Tx);
		context.shadowColor = "yellow";
		context.shadowBlur = 150;
	    context.closePath();
	    context.fill();
	}
	
	// Was getting used to generate random star placement, was having too many issues with rotations
	function getRandomInt(minValue, maxValue){
		minValue = Math.ceil(minValue);
		maxValue = Math.ceil(maxValue);
		return Math.floor(Math.random() * (maxValue - minValue) + minValue);
	}
	
	function drawBackground(Tx){
		context.fillStyle = "Black";
		context.beginPath();
		moveToTx([0,0],Tx);
		lineToTx([canvas.width,0],Tx);
		lineToTx([canvas.width,canvas.height],Tx);
		lineToTx([0,canvas.height],Tx);
		context.closePath();
		context.fill();
	}
	
/*	
	function drawStar(Tx){
		context.beginPath();
		context.fillStyle = "white";
		lineToTx([5,5],Tx);
		lineToTx([0,15],Tx);
		lineToTx([-5,5],Tx);
		lineToTx([0,-12],Tx);
		context.shadowColor = "yellow";
		context.shadowOffSetX = 0;
		context.shadowOffsetY = 0;
		context.shadowBlur = 150;
		context.closePath();
		context.fill();	
	}
*/

	var Rstart = 75.0;
	var Rslope = 50.0;
	var Cspiral = function(t) {
	    var R = Rslope * t + Rstart;
	    var x = R * Math.cos(2.0 * Math.PI * t);
	    var y = R * Math.sin(2.0 * Math.PI * t);
	    return [x,y];
	}
	
	var Cspiral_tangent = function(t) {
	    var R = Rslope * t + Rstart;
	    var Rprime = Rslope;
	    var x = Rprime * Math.cos(2.0 * Math.PI * t)
                - R * 2.0 * Math.PI * Math.sin(2.0 * Math.PI * t);
	    var y = Rprime * Math.sin(2.0 * Math.PI * t)
                + R * 2.0 * Math.PI * Math.cos(2.0 * Math.PI * t);
	    return [x,y];
	}

	// Formula for creating a circle
	var Ccircle = function(t, radius){
	    var Rcircle = radius;
		var x = Rcircle * Math.cos(2.0 * Math.PI * t);
	    var y = Rcircle * Math.sin(2.0 * Math.PI * t);
	    return [x,y];
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
	
	function fillTrajectory(t_begin,t_end,intervals,C,Tx,color, radius) {
	    context.fillStyle=color;
	    context.beginPath();
            moveToTx(C(t_begin, radius),Tx);
            for(var i=1;i<=intervals;i++){
				var t=((intervals-i)/intervals)*t_begin+(i/intervals)*t_end;
				lineToTx(C(t, radius),Tx);
            }
			context.shadowColor = color;
			context.shadowOffSetX = 0;
			context.shadowOffsetY = 0;
			context.shadowBlur = 100;
            context.fill();
	}

	
	// First drawing the background / night sky
	var background_to_canvas = mat3.create();
	drawBackground(background_to_canvas);
	
	// Drawing in the randommized stars
//	for(var i = 0; i < 50; i = i + 1){
//		var redefined = mat3.create();
//		mat3.fromTranslation(redefined, [getRandomInt(0,800),getRandomInt(0,500)]);
///		drawStar(redefined);
//	}
	
	// Adding in the sun 
	// Due to trouble with acrToTx I just fed the trajectory a circle shape and filled it
	var sun_to_canvas = mat3.create();
	// mat3.multiply(sun_to_canvas, background_to_canvas, sun_to_canvas);
	mat3.fromTranslation(sun_to_canvas, [canvas.width / 2, canvas.height / 2]);
	fillTrajectory(0.0,4.0,100,Ccircle, sun_to_canvas,"Yellow", 50);

	// Adding in Mars that orbits around the Sun
	var time = new Date();
	var orbit = ((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds();
	var mars_to_sun = mat3.create();
	mat3.fromTranslation(mars_to_sun, [150, 150]);
	mat3.rotate(sun_to_canvas, sun_to_canvas, orbit);
	var mars_to_canvas = mat3.create();
	mat3.multiply(mars_to_canvas, sun_to_canvas, mars_to_sun);
	fillTrajectory(0.0,4.0,100,Ccircle, mars_to_canvas, "Red", 25);
	//mat3.fromTranslation(mars_to_canvas,[20,25]);
	//fillTrajectory(0.0,4.0,100,Ccircle, mars_to_canvas, "Purple", 25);
	
	// Adding in a moon that orbits around Mars
	var moon_to_mars = mat3.create();
	mat3.fromTranslation(moon_to_mars,[30,30]);
	mat3.rotate(mars_to_canvas, mars_to_canvas, orbit);
	var moon_to_canvas = mat3.create();
	mat3.multiply(moon_to_canvas, mars_to_canvas, moon_to_mars);
	fillTrajectory(0.0,4.0,100,Ccircle, moon_to_canvas, "White", 10);
	
	// Adding in a purple planet
	var purple_to_sun = mat3.create();
	mat3.fromTranslation(mars_to_canvas, [185, -150]);
	mat3.rotate(purple_to_sun, mars_to_canvas, orbit);
	var purple_to_canvas = mat3.create();
	mat3.multiply(purple_to_canvas, sun_to_canvas, purple_to_sun);
	fillTrajectory(0.0,4.0,100, Ccircle, purple_to_canvas, "HotPink", 25);
	
	// Adding in a teal planet
	var teal_to_sun = mat3.create();
	mat3.fromTranslation(mars_to_canvas, [-86, -250]);
	mat3.rotate(teal_to_sun, mars_to_canvas, orbit);
	var teal_to_canvas = mat3.create();
	mat3.multiply(teal_to_canvas, sun_to_canvas, teal_to_sun);
	fillTrajectory(0.0,4.0,100, Ccircle, teal_to_canvas, "cyan", 42);
	
	// Adding in the Spaceship and Tracking System
	var Tblue_to_canvas = mat3.create();
	mat3.fromTranslation(Tblue_to_canvas,[canvas.width / 2, canvas.height / 2]);
	if(click_count > 0){
		drawTrajectory(-0.5,10.0,300,Cspiral,Tblue_to_canvas,"white");	
	}
	var Tgreen_to_blue = mat3.create();
	var timeParam = ((2 * Math.PI) / 60) * time.getSeconds() + ((2 * Math.PI) / 60000) * time.getMilliseconds();
	mat3.fromTranslation(Tgreen_to_blue,Cspiral(timeParam));
	var tangent = Cspiral_tangent(timeParam);
	var angle = Math.atan2(tangent[1],tangent[0]);
	mat3.rotate(Tgreen_to_blue,Tgreen_to_blue,angle);
	var Tgreen_to_canvas = mat3.create();
	mat3.multiply(Tgreen_to_canvas, Tblue_to_canvas, Tgreen_to_blue);
	drawSpaceShip("Chartreuse",Tgreen_to_canvas);
	
	// Future project could be making two projectiles that could fire from the ship
	// But only draw them when the space bar is pushed. The math/orienting them may be tough
	// Stay with the spaceschip or create own path?
	
	window.requestAnimationFrame(draw);
    }
	button1.addEventListener("click", function() {click_count = click_count + 1});
    window.requestAnimationFrame(draw);
}
window.onload = setup;