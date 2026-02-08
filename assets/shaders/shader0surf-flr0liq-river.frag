#define HIGHP


uniform sampler2D u_texture;
uniform vec2 u_campos;
uniform vec2 u_resolution;
uniform float u_time;
varying vec2 v_texCoords;


const float scl = 110.0;
const float thr = 70.0;
const float params[4 * 3] = float[](
	0.2, 1.8, 1.04,
	0.4, 1.6, 1.06,
	0.7, 1.3, 1.09,
	0.9, 1.1, 1.14
);


float getTester(vec2 pos, float time) {

	return mod((
	  (pos.x + pos.y * 1.8 + sin(time / 8.0 + pos.x / 5.0 - pos.y / 100.0) * 3.0)
		+ sin(time / 20.0 + pos.y / 3.0) * 18.0
		+ sin(time / 10.0 - pos.y / 2.0) * 9.0
		- sin(time / 7.0 + pos.y / 1.0) * 1.5
		+ sin(pos.x / 3.0 + pos.y / 2.0) * 2.5
		- sin(time / 25.0) * 7.5
		+ sin(time / 20.0 + pos.x / 4.0) * 8.0), scl
	);

}


void setColor(inout vec3 colorMod, float tester, float thr) {

	for(int i = 0; i < params.length(); i += 3) {
		if(tester > thr * params[i] && tester < thr * params[i + 1]) colorMod *= params[i + 2];
	};

}


void main() {

	vec2 vecRes = vec2(1.0 / u_resolution.x, 1.0 / u_resolution.y);
	float time = u_time / 5.0;

	vec2 posRaw = v_texCoords;
	vec2 pos = vec2(posRaw.x / vecRes.x + u_campos.x, posRaw.y / vecRes.y + u_campos.y);
  vec4 color = texture2D(u_texture, posRaw + vec2(sin(time / 3.0 + pos.y / 0.75) * vecRes.x, 0.0));
  vec3 colorMod = color.rgb * vec3(0.9, 0.9, 1.0);

  float tester = getTester(pos, time);
	setColor(colorMod, tester, thr);

	gl_FragColor = vec4(colorMod.rgb, min(color.a * 100.0, 1.0));

}
