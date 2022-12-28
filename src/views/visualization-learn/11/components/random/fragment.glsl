#ifdef GL_ES
precision mediump float;
#endif

varying vec2 vUv;
varying vec3 color;

uniform vec2 center;
uniform float scale;
uniform int iterations;


float random(vec2 st) {
  return fract(sin(dot(st.xy, vec2(12.9898, 78.233))) * 43758.5453123);
}

void main(){
  gl_FragColor.rgb = vec3(random(vUv));
  gl_FragColor.a = 1.0;
}