#define HIGHP

uniform sampler2D u_texture;
uniform vec2 u_uv;
uniform vec2 u_uv2;
uniform vec2 u_texsize;
uniform vec4 u_mulColor;
uniform float u_a;
uniform float u_off;
uniform float u_offCap;
varying vec2 v_texCoords;

const float scl = 140.0;
const float thr = 120.0;




float calcTester(vec2 pos) {
	return mod((
	  (pos.x + u_off * u_offCap / 22.5 + pos.y * 1.8 + sin(pos.x / 5.0 - pos.y / 100.0 + u_off) * 3.0)
		+ sin(pos.y / 3.0 + u_off) * 10.0
		+ sin(pos.y / 2.0) * 2.0
		- sin(pos.y / 1.0 + u_off * u_off) * 2.0
		+ sin(pos.y / 2.0 - u_off) * 0.5
		+ 25.0
		+ sin(pos.x / 4.0 - u_off) * 6.0), scl + u_off * u_offCap / 225.0
	);
}


float calcAMtp(float tester) {
	float diff = abs(tester - thr);
	if(diff > 60.0) return 1.0;
	if(diff > 50.0) return 0.85;
	if(diff > 45.0) return 0.7;
	if(diff > 40.0) return 0.5;

	return 0.0;
}


void main() {
  vec2 vecScl = vec2(1.0 / u_texsize.x, 1.0 / u_texsize.y);
	vec2 pos = (v_texCoords - u_uv) / vecScl;
	vec4 sampled = texture2D(u_texture, v_texCoords);
	if(sampled.a < 0.0001) {
		gl_FragColor = vec4(0.0);
		return;
	};
	vec3 color = sampled.rgb * u_mulColor.rgb;
	float tester = calcTester(pos);

	gl_FragColor = vec4(color.rgb, u_a * calcAMtp(tester));
}
