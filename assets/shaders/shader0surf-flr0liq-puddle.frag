#define HIGHP
#define NSCALE 450.0

uniform sampler2D u_texture;
uniform sampler2D u_noise;
uniform vec2 u_campos;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_texCoords;


const float params[4 * 3] = float[](
	0.45, 0.7, 1.1,
	0.5, 0.7, 1.1,
	0.54, 0.7, 1.1,
	0.57, 0.7, 1.1
);


float getTester(vec2 pos, float time) {

  return (
    texture2D(u_noise, (pos) / NSCALE + vec2(time) * vec2(-0.9, 0.8)).r
    + texture2D(u_noise, (pos) / NSCALE + vec2(time * 1.1) * vec2(-0.8, -1.0)).r
  ) * 0.5;

}


void setColor(inout vec3 colorMod, float tester) {

  for(int i = 0; i < params.length(); i += 3) {
    if(tester > params[i] && tester < params[i + 1]) colorMod *= params[i + 2];
  };

}


void main() {

  float time = u_time / 12000.0;

  vec2 posRaw = v_texCoords.xy;
  vec2 pos = vec2(posRaw.x * u_resolution.x + u_campos.x, posRaw.y * u_resolution.y + u_campos.y);
  vec4 color = texture2D(u_texture, posRaw);
  vec3 colorMod = color.rgb * vec3(0.9, 0.9, 1.0);

  float tester = getTester(pos, time);
  setColor(colorMod, tester);

  gl_FragColor = vec4(colorMod.rgb, min(color.a * 100.0, 1.0));

}
