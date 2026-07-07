#define HIGHP

uniform sampler2D u_texture;
uniform vec2 u_campos;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_texCoords;

const float scl = 110.0;
const float thr = 40.0;
const float params[4 * 3] = float[](
	0.3, 1.7, 1.1,
	0.6, 1.4, 1.1,
	0.8, 1.2, 1.1,
	0.9, 1.1, 1.1
);




float calcTester(vec2 pos, float time) {
	return mod((
	  (pos.x + pos.y * 1.8 + sin(time / 8.0 + pos.x / 5.0 - pos.y / 100.0) * 3.0)
		+ sin(time / 20.0 + pos.y / 3.0) * 10.0
		+ sin(time / 10.0 - pos.y / 2.0) * 2.0
		- sin(time / 7.0 + pos.y / 1.0) * 2.0
		+ sin(pos.x / 3.0 + pos.y / 2.0) * 0.5
		+ sin(time / 25.0) * 25.0
		+ sin(time / 20.0 + pos.x / 4.0) * 6.0), scl
	);
}


void setColor(inout vec3 color, float tester, float thr) {
	for(int i = 0; i < params.length(); i += 3) {
		if(tester > thr * params[i] && tester < thr * params[i + 1]) color *= params[i + 2];
	};
}


void main() {
	vec2 vecRes = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);
	float time = u_time / 5.0;

	vec2 posRaw = v_texCoords;
	vec2 pos = vec2(posRaw.x / vecRes.x + u_campos.x, posRaw.y / vecRes.y + u_campos.y);
  vec4 sample = texture2D(u_texture, posRaw + vec2(sin(time / 3.0 + pos.y / 0.75) * vecRes.x, 0.0));
  vec3 color = sample.rgb * vec3(0.9, 0.9, 1.0);

  float tester = calcTester(pos, time);
	setColor(color, tester, thr);

	gl_FragColor = vec4(color.rgb, sample.a);
}
