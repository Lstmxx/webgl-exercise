#ifdef GL_ES
precision highp float;
#endif
varying vec2 vUv;
uniform float uTime;

float random (vec2 st) {
    return fract(sin(dot(st.xy,
                        vec2(12.9898,78.233)))*
        43758.5453123);
}
void main() {
    vec2 st = vUv * 10.0;
    float t = fract(uTime) % 256;
    gl_FragColor.rgb = vec3(random(floor(st)), 77, 99);
    gl_FragColor.a = 1.0;
}