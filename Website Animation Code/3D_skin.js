// Class: CS 559
// Title: Assignment 7
// Name: Jacob Hawig
// Student ID: 9078102226

function start() {

    // Get canvas, WebGL context, twgl.m4
    var canvas = document.getElementById("mycanvas");
    var gl = canvas.getContext("webgl");

    // Sliders at center
    var slider1 = document.getElementById('slider1');
    slider1.value = -90;
    var slider2 = document.getElementById('slider2');
    slider2.value = 0;
	var slider3 = document.getElementById('slider3');
    slider3.value = 400.0;
	var slider4 = document.getElementById('slider4');
	slider4.value = 2;
	var slider5 = document.getElementById('slider5');
	slider5.value = 2;

    // Read shader source
    var vertexSource = document.getElementById("vertexShader").text;
    var fragmentSource = document.getElementById("fragmentShader").text;

    // Compile vertex shader
    var vertexShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertexShader,vertexSource);
    gl.compileShader(vertexShader);
    if (!gl.getShaderParameter(vertexShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(vertexShader)); return null; }
    
    // Compile fragment shader
    var fragmentShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragmentShader,fragmentSource);
    gl.compileShader(fragmentShader);
    if (!gl.getShaderParameter(fragmentShader, gl.COMPILE_STATUS)) {
      alert(gl.getShaderInfoLog(fragmentShader)); return null; }
    
    // Attach the shaders and link
    var shaderProgram = gl.createProgram();
    gl.attachShader(shaderProgram, vertexShader);
    gl.attachShader(shaderProgram, fragmentShader);
    gl.linkProgram(shaderProgram);
    if (!gl.getProgramParameter(shaderProgram, gl.LINK_STATUS)) {
      alert("Could not initialize shaders"); }
    gl.useProgram(shaderProgram);	    
    
    // with the vertex shader, we need to pass it positions
    // as an attribute - so set up that communication
    shaderProgram.PositionAttribute = gl.getAttribLocation(shaderProgram, "vPosition");
    gl.enableVertexAttribArray(shaderProgram.PositionAttribute);
    
    shaderProgram.NormalAttribute = gl.getAttribLocation(shaderProgram, "vNormal");
    gl.enableVertexAttribArray(shaderProgram.NormalAttribute);
    
    shaderProgram.ColorAttribute = gl.getAttribLocation(shaderProgram, "vColor");
    gl.enableVertexAttribArray(shaderProgram.ColorAttribute);
    
    shaderProgram.texcoordAttribute = gl.getAttribLocation(shaderProgram, "vTexCoord");
    gl.enableVertexAttribArray(shaderProgram.texcoordAttribute);
   
    // this gives us access to the matrix uniform
    shaderProgram.MVmatrix = gl.getUniformLocation(shaderProgram,"uMV");
    shaderProgram.MVNormalmatrix = gl.getUniformLocation(shaderProgram,"uMVn");
    shaderProgram.MVPmatrix = gl.getUniformLocation(shaderProgram,"uMVP");

    // Attach samplers to texture units
    shaderProgram.texSampler1 = gl.getUniformLocation(shaderProgram, "texSampler1");
    gl.uniform1i(shaderProgram.texSampler1, 0);
    shaderProgram.texSampler2 = gl.getUniformLocation(shaderProgram, "texSampler2");
    gl.uniform1i(shaderProgram.texSampler2, 1);

    // Data ...
    
    // vertex positions
    var vertexPos = new Float32Array(
        [  0.5,1,0.5,	-0.5,1,0.5,		-1,-1,1,   		1,-1,1, // front facing edge
           0.5,1,0.5,  	1,-1,1,   		1,-1,-1,   		0.5, 1,-0.5, // edge on right side
           0.5,1,0.5,   0.5,1,-0.5, 	-0.5,1,-0.5,	-0.5,1,0.5, // top square
          -0.5,1,0.5,  	-0.5,1,-0.5,  	-1,-1,-1, 		-1,-1,1, // edge on the left side
          -1,-1,-1,   	1,-1,-1,   		1,-1,1,  		-1,-1,1, // bottom of the pyramid
           1,-1,-1,  	-1,-1,-1,  		-0.5,1,-0.5,   	0.5,1,-0.5 ]); // back edge

    // vertex normals
    var vertexNormals = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);

    // vertex colors
    var vertexColors = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
    
    // vertex texture coordinates
    var vertexTextureCoords = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   0, 1,
           1, 0,   1, 1,   0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0, 1,   0, 0,   1, 0 ]);

    // element index array
    var triangleIndices = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos, gl.STATIC_DRAW);
    trianglePosBuffer.itemSize = 3;
    trianglePosBuffer.numItems = 24;
    
    // a buffer for normals
    var triangleNormalBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals, gl.STATIC_DRAW);
    triangleNormalBuffer.itemSize = 3;
    triangleNormalBuffer.numItems = 24;
    
    // a buffer for colors
    var colorBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors, gl.STATIC_DRAW);
    colorBuffer.itemSize = 3;
    colorBuffer.numItems = 24;

    // a buffer for textures
    var textureBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords, gl.STATIC_DRAW);
    textureBuffer.itemSize = 2;
    textureBuffer.numItems = 24;

    // a buffer for indices
    var indexBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices, gl.STATIC_DRAW);


	// SECOND ELEMENT

	// vertex positions
    var vertexPos2 = new Float32Array(
		[	
			-0.5, 1.1,0.5,   0.5,1.1,0.5,   	 0,2,0,     0, 2,0, //front (CORRECT)
			0.5, 1.1,0.5,   0.5, 1.1,-0.5,	 0,2,0,   	  0, 2,0, //right(CORRECT)
			-0.5,1.1,-0.5,   0.5,1.1,-0.5,    0.5, 1.1, 0.5,  -0.5,1.1,-0.5, // bottom()
			-0.5, 1.1,-0.5,  -0.5,1.1,0.5,    0,2,0,   	  0, 2,0, //left()
            -0.5,1.1,0,   	 0.5,1.1,0,  	 0.5, 1.1,0.5,   -0.5,1.1,0.5, //bottom ()
		    0.5, 1.1,-0.5,   -0.5,1.1,-0.5,   0,2,0,   	  0, 2,0 //back edge ()
		]); 

    // vertex normals
    var vertexNormals2 = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1, 
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0, 
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0, 
          -1, 0, 0,  -1, 0, 0,  -1, 0, 0,  -1, 0, 0, 
           0,-1, 0,   0,-1, 0,   0,-1, 0,   0,-1, 0, 
           0, 0,-1,   0, 0,-1,   0, 0,-1,   0, 0,-1  ]);

    // vertex colors
    var vertexColors2 = new Float32Array(
        [  0, 0, 1,   0, 0, 1,   0, 0, 1,   0, 0, 1,
           1, 0, 0,   1, 0, 0,   1, 0, 0,   1, 0, 0,
           0, 1, 0,   0, 1, 0,   0, 1, 0,   0, 1, 0,
           1, 1, 0,   1, 1, 0,   1, 1, 0,   1, 1, 0,
           1, 0, 1,   1, 0, 1,   1, 0, 1,   1, 0, 1,
           0, 1, 1,   0, 1, 1,   0, 1, 1,   0, 1, 1 ]);
    
    // vertex texture coordinates
    var vertexTextureCoords2 = new Float32Array(
        [  0, 0,   1, 0,   1, 1,   0, 1,
           1, 0,   1, 1,   0, 1,   0, 0,
           0, 1,   0, 0,   1, 0,   1, 1,
           0, 0,   1, 0,   1, 1,   0, 1,
           1, 1,   0, 1,   0, 0,   1, 0,
           1, 1,   0, 1,   0, 0,   1, 0 ]);

    // element index array
    var triangleIndices2 = new Uint8Array(
        [  0, 1, 2,   0, 2, 3,    // front
           4, 5, 6,   4, 6, 7,    // right
           8, 9,10,   8,10,11,    // top
          12,13,14,  12,14,15,    // left
          16,17,18,  16,18,19,    // bottom
	      20,21,22,  20,22,23 ]); // back

    // we need to put the vertices into a buffer so we can
    // block transfer them to the graphics hardware
    var trianglePosBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexPos2, gl.STATIC_DRAW);
    trianglePosBuffer2.itemSize = 3;
    trianglePosBuffer2.numItems = 24;
    
    // a buffer for normals
    var triangleNormalBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexNormals2, gl.STATIC_DRAW);
    triangleNormalBuffer2.itemSize = 3;
    triangleNormalBuffer2.numItems = 24;
    
    // a buffer for colors
    var colorBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexColors2, gl.STATIC_DRAW);
    colorBuffer2.itemSize = 3;
    colorBuffer2.numItems = 24;

    // a buffer for textures
    var textureBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer2);
    gl.bufferData(gl.ARRAY_BUFFER, vertexTextureCoords2, gl.STATIC_DRAW);
    textureBuffer2.itemSize = 2;
    textureBuffer2.numItems = 24;

    // a buffer for indices
    var indexBuffer2 = gl.createBuffer();
    gl.bindBuffer(gl.ELEMENT_ARRAY_BUFFER, indexBuffer2);
    gl.bufferData(gl.ELEMENT_ARRAY_BUFFER, triangleIndices2, gl.STATIC_DRAW);

    // Set up texture
    var texture1 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture1);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image1 = new Image();

    var texture2 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture2);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image2 = new Image();
	
	var texture3 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture3);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image3 = new Image();
	
	var texture4 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture4);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image4 = new Image();
	
	var texture5 = gl.createTexture();
    gl.activeTexture(gl.TEXTURE0);
    gl.bindTexture(gl.TEXTURE_2D, texture5);
    gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, 1, 1, 0, gl.RGBA, gl.UNSIGNED_BYTE, null);
    var image5 = new Image();
	

    function initTextureThenDraw()
    {
	  // Gold Image
      image1.onload = function() { loadTexture(image1,texture1); };
	  image1.crossOrigin = "anonymous";
	  image1.src ="https://farm6.staticflickr.com/65535/51749277318_26aabe45c9_b.jpg";
	  
      // Fire Image
      image2.onload = function() { loadTexture(image2,texture2); };
      image2.crossOrigin = "anonymous";
      image2.src = "https://farm6.staticflickr.com/65535/51749711133_e60a95778d_b.jpg";  
	  
	  // Snake Image
	  image3.onload = function() { loadTexture(image3,texture3); };
      image3.crossOrigin = "anonymous";
	  image3.src = "https://farm6.staticflickr.com/65535/51750343440_6712298a13_b.jpg";
	  
	  // Water Image
	  image4.onload = function() { loadTexture(image4,texture4); };
      image4.crossOrigin = "anonymous";
	  image4.src = "https://farm6.staticflickr.com/65535/51750202459_502aa1c53f_b.jpg";
      
	  // Code Image
	  image5.onload = function(){ loadTexture(image5, texture5);};
	  image5.crossOrigin = "anonymous";
	  image5.src = "https://farm6.staticflickr.com/65535/51748761597_6dc1819858_b.jpg";
	  
	  window.setTimeout(draw,20);
    }

    function loadTexture(image,texture)
    {
      gl.bindTexture(gl.TEXTURE_2D, texture);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);

      // Option 1 : Use mipmap, select interpolation mode
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
    }    
    // Scene (re-)draw routine
    function draw() {
    
        // Translate slider values to angles in the [-pi,pi] interval
        var angle1 = slider1.value*0.01*Math.PI;
        var angle2 = slider2.value*0.01*Math.PI;
		var vertical_shift = slider3.value;
		var skin_top = slider4.value;
		var skin_bottom = slider5.value;
    
        // Circle around the y-axis
        var eye = [400.0*Math.sin(angle1),vertical_shift,400.0*Math.cos(angle1)];
        var target = [0,0,0];
        var up = [0,1,0];
    
        var tModel = mat4.create();
        mat4.fromScaling(tModel,[100,100,100]);
        mat4.rotate(tModel,tModel,angle2,[1,1,1]);
      
        var tCamera = mat4.create();
        mat4.lookAt(tCamera, eye, target, up);      

        var tProjection = mat4.create();
        mat4.perspective(tProjection,Math.PI/4,1,10,1000);
      
        var tMV = mat4.create();
        var tMVn = mat3.create();
        var tMVP = mat4.create();
        mat4.multiply(tMV,tCamera,tModel); // "modelView" matrix
        mat3.normalFromMat4(tMVn,tMV);
        mat4.multiply(tMVP,tProjection,tMV);
      
        // Clear screen, prepare for rendering
        gl.clearColor(0.0, 0.0, 0.0, 1.0);
        gl.enable(gl.DEPTH_TEST);
        gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);
    
        // Set up uniforms & attributes
        gl.uniformMatrix4fv(shaderProgram.MVmatrix,false,tMV);
        gl.uniformMatrix3fv(shaderProgram.MVNormalmatrix,false,tMVn);
        gl.uniformMatrix4fv(shaderProgram.MVPmatrix,false,tMVP);
                 
        gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer.itemSize,
          gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer.itemSize,
          gl.FLOAT, false, 0, 0);
		

		// Bind texture
		if(skin_bottom < 2){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
		} else if(skin_bottom == 2) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
		} else if(skin_bottom == 3){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture3);
		} else if(skin_bottom == 4){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture4);
		} else {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture5);
		}
		
		
		// Do the drawing
		gl.drawElements(gl.TRIANGLES, triangleIndices.length, gl.UNSIGNED_BYTE, 0);
		  
		gl.bindBuffer(gl.ARRAY_BUFFER, trianglePosBuffer2);
        gl.vertexAttribPointer(shaderProgram.PositionAttribute, trianglePosBuffer2.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, triangleNormalBuffer2);
        gl.vertexAttribPointer(shaderProgram.NormalAttribute, triangleNormalBuffer2.itemSize,
          gl.FLOAT, false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, colorBuffer2);
        gl.vertexAttribPointer(shaderProgram.ColorAttribute, colorBuffer2.itemSize,
          gl.FLOAT,false, 0, 0);
        gl.bindBuffer(gl.ARRAY_BUFFER, textureBuffer2);
        gl.vertexAttribPointer(shaderProgram.texcoordAttribute, textureBuffer2.itemSize,
          gl.FLOAT, false, 0, 0);

        // Bind texture
		if(skin_top < 2){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture1);
		} else if(skin_top == 2) {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture2);
		} else if(skin_top == 3){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture3);
		} else if(skin_top == 4){
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture4);
		} else {
			gl.activeTexture(gl.TEXTURE0);
			gl.bindTexture(gl.TEXTURE_2D, texture5);
		}
		

        // Do the drawing
		gl.drawElements(gl.TRIANGLES, triangleIndices2.length, gl.UNSIGNED_BYTE, 0);
		//draw();
    }
    slider1.addEventListener("input",draw);
    slider2.addEventListener("input",draw);
	slider3.addEventListener("input",draw);
	slider4.addEventListener("input",draw);
	slider5.addEventListener("input",draw);
    initTextureThenDraw();
}

window.onload=start;