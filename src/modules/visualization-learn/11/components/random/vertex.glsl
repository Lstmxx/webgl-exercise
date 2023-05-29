attribute vec2 a_vertex_position;

attribute vec2 uv;

varying vec2 vUv;
varying vec3 color;
void main(){
  gl_PointSize = 1.0;
  vUv = uv;
  color = vec3(0.5 + a_vertex_position * 0.5, 0.0);
  gl_Position = vec4(a_vertex_position, 1, 1);
}