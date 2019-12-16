"use strict";
/* exported TexturedQuadGeometry */
class ClippedQuadric extends UniformProvider {
    constructor(id, ...programs) {
      super(`clippedQuadrics[${id}]`);
      this.addComponentsAndGatherUniforms(...programs);
      //this.surface = new Mat4();
      //this.clipper = new Mat4();
    }
    makeUnitCylinder(){
      this.surface.set(1,  0,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  1,  0,
                  0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                  0,  0.5,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0, -1);
      this.colour.set(0.75, 0.3, 0)
    }

      makeUnitCone(){
      this.surface.set(1,  0,  0,  0,
                  0,  0,  0,  1,
                  0,  0,  1,  0,
                  0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                  0,  1,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0, -1);
      this.colour.set(0,1,0)
    }

    makeUnitPlane(){
      this.surface.set(0, 0, 0, 0,
                    0, 1, 0, 0,
                    0, 0, 0, 0,
                    0, 0, 0, -1)

       this.clipper.set(0,  0,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0, -1);
       this.colour.set(0,0.5,1)
    }

        makeUnitSphere(){
      this.surface.set(1,  0,  0,  0,
                  0,  1,  0,  0,
                  0,  0,  1,  0,
                  0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                  0,  1,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0, -1);
      this.colour.set(1, 1, 1)
    }

    makeUnitElipsoid(){
      this.surface.set(1,  0,  1,  0,
                  0,  1,  0,  0,
                  0,  0,  1,  0,
                  0,  0,  0, -1);
      this.clipper.set(0,  0,  0,  0,
                  0,  1,  0,  0,
                  0,  0,  0,  0,
                  0,  0,  0, -1);
      this.colour.set(1, 1, 1)
    }

    setColor(r, g, b){
      this.colour.set(r, g, b)
    }

    transform(T){
      T.invert();    // T is now T-1
      this.surface.premul(T);   // A is now T-1 * A
      this.clipper.premul(T);
      T.transpose(); // T is now T-1T
      this.surface.mul(T);
      this.clipper.mul(T);      // A is now A'

    }
}
