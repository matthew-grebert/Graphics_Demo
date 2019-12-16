Shader.source[document.currentScript.src.split('js/shaders/')[1]] = `#version 300 es 
  precision highp float;

  out vec4 fragmentColor;
  in vec4 rayDir;

  uniform struct {
  	samplerCube envTexture;
  } material;

  uniform struct {
    mat4 viewProjMatrix;  
    mat4 rayDirMatrix;
    vec3 position;
  } camera;

  uniform struct {
    mat4 surface;
    mat4 clipper;
    vec3 colour;
  } clippedQuadrics[16];

  uniform struct {
    vec4 position;
    vec3 powerDensity;
  } lights[8];



  float intersectClippedQuadric (mat4 A, mat4 B, vec4 e, vec4 d){
    float toReturn = -1.0;
    float aCoeff = dot(d * A, d);
    float bCoeff = dot(d * A, e) + dot(e * A, d);
    float cCoeff = dot(e * A, e);
    float discrim = bCoeff*bCoeff-(4.0*aCoeff*cCoeff);
    if(discrim < 0.0){
      return toReturn; //-1
    }
    float t1 = (-bCoeff + sqrt(discrim))/(2.0*aCoeff);
    float t2 = (-bCoeff - sqrt(discrim))/(2.0*aCoeff);
    vec4 r1 = e+d*t1;
    vec4 r2 = e+d*t2;

    if(dot(r1*B, r1) > 0.0){
      t1 = -1.0;
    }

    if(dot(r2*B, r2) > 0.0){
      t2 = -1.0;
    }



    return (t1<0.0)?t2:((t2<0.0)?t1:min(t1, t2));

  }

  bool findBestHit (vec4 e, vec4 d, out float bestT, out int bestIndex ){
    bestT = 1000000.0;
    bestIndex= -1;
    for(int i = 0; i < 16; i++){
      float t = intersectClippedQuadric(clippedQuadrics[i].surface, clippedQuadrics[i].clipper, e, d);
      if(t < bestT && t > 0.0){

        bestIndex = i;
        bestT = t;
      }
    }
    return !(bestIndex == -1);
  }

  vec3 shade(
  vec3 normal, vec3 lightDir,
  vec3 powerDensity, vec3 materialColor) {
    float cosa = clamp( dot(lightDir, normal),0.0,1.0);
    return powerDensity * materialColor * cosa;
}



  void main(void) {
  float bT;
  int bI;
  float t = 1.0;
	vec4 e = vec4(camera.position, 1);		 //< ray origin
  vec4 d = vec4(normalize(rayDir).xyz, 0); //< ray direction
  mat4 A = mat4(  1, 0, 0, 0,
    0, 1, 0, 0,
    0, 0, 1, 0,
    0, 0, 0, -9 );

  mat4 B = mat4(  1, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, 0,
    0, 0, 0, -4);


  vec3 w = vec3(1, 1, 1); 

  if(findBestHit(e, d, bT, bI)){
    t = bT;
  }else{
    t = -1.0;
  }
  if(t < 0.0){  
    fragmentColor = texture(material.envTexture, d.xyz );
    gl_FragDepth = 0.9999999;
  }else{
    vec4 hit = e + d * t;
    vec3 normal = normalize( (hit *  clippedQuadrics[bI].surface +  clippedQuadrics[bI].surface * hit).xyz );

    vec4 ndcHit = hit * camera.viewProjMatrix;
    gl_FragDepth = ndcHit.z / ndcHit.w * 0.5 + 0.5;
    fragmentColor.rgb = clippedQuadrics[bI].colour;
    fragmentColor.rgb = shade(normal, lights[0].position.xyz, lights[0].powerDensity, clippedQuadrics[bI].colour);

    vec4 reflectionE = hit + 0.001 * vec4(normal,0);
    vec4 reflectionD = vec4(reflect(d.xyz, normal),0);
    if(bI == 14){
      if(findBestHit(reflectionE, reflectionD, bT, bI)){
        t = bT;
      }else{
        t = -1.0;
      }
      if(t < 0.0){  
        fragmentColor = texture(material.envTexture, d.xyz );
      }else{
        hit = reflectionE + reflectionD * t;
        normal = normalize( (hit *  clippedQuadrics[bI].surface +  clippedQuadrics[bI].surface * hit).xyz );
        fragmentColor.rgb = shade(normal, lights[0].position.xyz, lights[0].powerDensity, clippedQuadrics[bI].colour);
      }
    }

  vec4 shadowE = hit + 0.001 * vec4(normal,0);
  vec4 shadowD = vec4(lights[0].position.xyz, 0);
  if(findBestHit(shadowE, shadowD, bT, bI)){
    t = bT;
  }else{
    t = -1.0;
  }
  if( t > 0.0) {
    fragmentColor.rgb = vec3(0,0,0);
  }

  }


    //My attempts at shadows
  
    //My attempts at reflection
 
    
   

  
    


  }



    // computing depth from world space hit coordinates 
    // vec4 ndcHit = hit * camera.viewProjMatrix;
    // gl_FragDepth = ndcHit.z / ndcHit.w * 0.5 + 0.5;

    // nothing hit by ray, return enviroment color
	

  
`;