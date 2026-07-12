#define HIGHP
#define NSCALE 500.0
#define DSCALE 300.0

uniform sampler2D u_texture;
uniform sampler2D u_noise;
uniform vec2 u_campos;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_texCoords;

const float params[4 * 3] = float[](
	0.05, 5.0, 1.1,
	0.35, 5.0, 1.1,
	0.6, 5.0, 1.1,
	0.8, 5.0, 1.1
);




float calcTester(vec2 pos, float time) {
	float tester = (
		texture2D(u_noise, pos / DSCALE + vec2(time) * vec2(-0.9, 0.8)).r
		+ texture2D(u_noise, pos / DSCALE + vec2(time * 1.2) * vec2(0.8, -1.0)).r
	) * 0.5;
	tester = abs(tester - 0.5) * 7.5 + 0.2;

	return tester;
}


void setColor(inout vec3 color, float tester) {
  for(int i = 0; i < params.length(); i += 3) {
    if(tester > params[i] && tester < params[i + 1]) color *= params[i + 2];
  };
}


void main() {
  float time1 = u_time / 16000.0;
	float time2 = u_time / 10000.0;

  vec2 posRaw = v_texCoords.xy;
	vec2 pos = vec2(posRaw * u_resolution) + u_campos;
  vec4 sampled = texture2D(u_texture, posRaw);
	posRaw += (vec2(
		texture2D(u_noise, pos / NSCALE + vec2(time2) * vec2(-0.9, 0.8)).r,
		texture2D(u_noise, pos / NSCALE + vec2(time2 * 1.2) * vec2(0.8, -1.0)).r
	) - vec2(0.5)) * 20.0 / u_resolution;
	vec3 color = texture2D(u_texture, posRaw).rgb * vec3(0.9, 0.9, 1.0);

  float tester = calcTester(pos, time1);
  setColor(color, tester);

	gl_FragColor = vec4(max(color.rgb, sampled.rgb * 0.85), sampled.a);
}
