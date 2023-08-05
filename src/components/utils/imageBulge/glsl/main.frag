precision highp float;
uniform float uTime;
uniform sampler2D uTexture;
uniform vec2 uMouse;

varying vec2 vUv;

const float radius = 0.6;
const float strength = 1.1;

vec2 bulge(vec2 uv, vec2 center) {
  uv -= center;
  
  float dist = length(uv) / radius; // distance from UVs top right corner
  float distPow = pow(dist, 2.);
  float strengthAmount = strength / (1.0 + distPow);
  uv *= strengthAmount; 
  
  uv += center;

  return uv;
}

void main() {
  vec2 bulgeUV = bulge(vUv, uMouse);
  vec4 tex = texture2D(uTexture, bulgeUV);
  gl_FragColor.rgb = tex.rgb;
  gl_FragColor.a = 1.0;
}