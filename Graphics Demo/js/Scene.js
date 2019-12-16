"use strict";
/* exported Scene */
class Scene extends UniformProvider {
  constructor(gl) {
    super("scene");
    this.programs = [];
    this.gameObjects = [];
    this.clippedQuadrics = [];
    this.lights = [];
    


    this.fsTextured = new Shader(gl, gl.FRAGMENT_SHADER, "textured-fs.glsl");
    this.vsTextured = new Shader(gl, gl.VERTEX_SHADER, "textured-vs.glsl");    
    this.programs.push( 
    	this.texturedProgram = new TexturedProgram(gl, this.vsTextured, this.fsTextured));

    this.vsQuad = new Shader(gl, gl.VERTEX_SHADER, "quad-vs.glsl");    
    this.fsTrace = new Shader(gl, gl.FRAGMENT_SHADER, "trace-fs.glsl");
    this.fsShow = new Shader(gl, gl.FRAGMENT_SHADER, "show-fs.glsl");
    this.programs.push( 
    	this.traceProgram = new TexturedProgram(gl, this.vsQuad, this.fsTrace));
    this.programs.push( 
      this.showProgram = new TexturedProgram(gl, this.vsQuad, this.fsShow));

    this.texturedQuadGeometry = new TexturedQuadGeometry(gl); 
    this.plainGeometry = new PlainGeometry(gl);
     this.material = new Material(this.texturedProgram);


    this.lights.push(new Light(this.lights.length, ...this.programs));
    this.lights[0].position.set(1, 1, 1, -1).normalize();
    this.lights[0].powerDensity.set(1, 1, 1);

    this.timeAtFirstFrame = new Date().getTime();
    this.timeAtLastFrame = this.timeAtFirstFrame;

    this.traceMaterial = new Material(this.traceProgram);
    this.envTexture = new TextureCube(gl, [
      "media/fnx.png",
      "media/fx.png",
      "media/fy.png",
      "media/fny.png",
      "media/fz.png",
      "media/fnz.png",]
      );
    this.traceMaterial.envTexture.set(this.envTexture);
    this.traceMesh = new Mesh(this.traceMaterial, this.texturedQuadGeometry);

    this.traceQuad = new GameObject(this.traceMesh);
    this.gameObjects.push(this.traceQuad);
    this.camera = new PerspectiveCamera(...this.programs); 
    this.camera.position.set(0, 5, 25);
    this.camera.update();
    this.addComponentsAndGatherUniforms(...this.programs);

    for(var i = 0; i < 16; i++){
    	this.clippedQuadrics.push(
      		new ClippedQuadric(this.clippedQuadrics.length, ...this.programs));
	}	
   	 
	//floor
    this.clippedQuadrics[0].makeUnitPlane();
    this.clippedQuadrics[0].transform(new Mat4().translate(0, -2, 0))
    //snowman

    //Body
    this.clippedQuadrics[1].makeUnitSphere();
    this.clippedQuadrics[1].transform(new Mat4().translate(3, 0, 8))
    this.clippedQuadrics[2].makeUnitSphere();
    this.clippedQuadrics[2].transform(new Mat4().scale(0.75))
    this.clippedQuadrics[2].transform(new Mat4().translate(3, 1, 8))
    this.clippedQuadrics[3].makeUnitSphere()
    this.clippedQuadrics[3].transform(new Mat4().scale(0.5))
    this.clippedQuadrics[3].transform(new Mat4().translate(3, 1.75, 8))

    //Buttons

    //Middle Button
    this.clippedQuadrics[4].makeUnitSphere()
    this.clippedQuadrics[4].transform(new Mat4().scale(0.1))
    this.clippedQuadrics[4].transform(new Mat4().translate(3.75, 1, 8))
    this.clippedQuadrics[4].setColor(0,0,0)

    //Top Button
    this.clippedQuadrics[5].makeUnitSphere()
    this.clippedQuadrics[5].transform(new Mat4().scale(0.1))
    this.clippedQuadrics[5].transform(new Mat4().translate(3.75, 1.3, 8))
    this.clippedQuadrics[5].setColor(0,0,0)

    //Bottom Button
    this.clippedQuadrics[6].makeUnitSphere()
    this.clippedQuadrics[6].transform(new Mat4().scale(0.1))
    this.clippedQuadrics[6].transform(new Mat4().translate(3.75, 0.7, 8))
    this.clippedQuadrics[6].setColor(0,0,0)

    //Eyes
    this.clippedQuadrics[7].makeUnitSphere()
    this.clippedQuadrics[7].transform(new Mat4().scale(0.1))
    this.clippedQuadrics[7].transform(new Mat4().translate(3.3, 1.85, 7.7))
    this.clippedQuadrics[7].setColor(0,0,0)
    this.clippedQuadrics[8].makeUnitSphere()
    this.clippedQuadrics[8].transform(new Mat4().scale(0.1))
    this.clippedQuadrics[8].transform(new Mat4().translate(3.3, 1.85, 8.3))
    this.clippedQuadrics[8].setColor(0,0,0)

    //Nose/mouth
    this.clippedQuadrics[9].makeUnitCone()
    this.clippedQuadrics[9].transform(new Mat4().scale(0.2))
    this.clippedQuadrics[9].transform(new Mat4().rotate(3*Math.PI/2))
    this.clippedQuadrics[9].transform(new Mat4().translate(3.5, 1.75, 8))
    this.clippedQuadrics[9].setColor(1, 0.5, 0)

  
    //Tree

    //Trunk
    this.clippedQuadrics[10].makeUnitCylinder()
    this.clippedQuadrics[10].transform(new Mat4().translate(-3, 0, -3))

    //Leaves

    //Bottom Cone
    this.clippedQuadrics[11].makeUnitCone()
    this.clippedQuadrics[11].transform(new Mat4().scale(3))
    this.clippedQuadrics[11].transform(new Mat4().translate(-3, 4, -3))
    //Middle Cone
    this.clippedQuadrics[12].makeUnitCone()
    this.clippedQuadrics[12].transform(new Mat4().scale(2.5))
    this.clippedQuadrics[12].transform(new Mat4().translate(-3, 7, -3))
    //Top Cone
    this.clippedQuadrics[13].makeUnitCone()
    this.clippedQuadrics[13].transform(new Mat4().scale(2.08))
    this.clippedQuadrics[13].transform(new Mat4().translate(-3, 9.52, -3))

    //Elipsiods
    this.clippedQuadrics[14].makeUnitElipsoid();
    this.clippedQuadrics[14].transform(new Mat4().translate(3, 0, 3))



    gl.enable(gl.DEPTH_TEST);
  }

  resize(gl, canvas) {
    gl.viewport(0, 0, canvas.width, canvas.height);
    this.camera.setAspectRatio(canvas.width / canvas.height);
  }

  update(gl, keysPressed) {
    //jshint bitwise:false
    //jshint unused:false
    const timeAtThisFrame = new Date().getTime();
    const dt = (timeAtThisFrame - this.timeAtLastFrame) / 1000.0;
    const t = (timeAtThisFrame - this.timeAtFirstFrame) / 1000.0; 
    this.timeAtLastFrame = timeAtThisFrame;
    //this.time.set(t);
    this.time = t;

    // clear the screen
    gl.clearColor(0.3, 0.0, 0.3, 1.0);
    gl.clearDepth(1.0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    this.camera.move(dt, keysPressed);

    for(const gameObject of this.gameObjects) {
        gameObject.update();
    }
    for(const gameObject of this.gameObjects) {
        //	gameObject.draw(this, this.camera, ...this.clippedQuadrics);
    }

    for(const gameObject of this.gameObjects) {
        gameObject.draw(this, this.camera, ...this.lights, ...this.clippedQuadrics);
    }

  }
}
