#ifdef GL_ES
precision highp float;
#endif

varying vec2 vTextureCoord;

uniform sampler2D uSampler;
uniform sampler2D uSampler2;
uniform float timeFactor;

uniform float r;
uniform float g;
uniform float b;

void main() {
	vec4 color = texture2D(uSampler, vTextureCoord);
	
	float n = sin(timeFactor) + 1.0;
    float t = n / 2.0;
    float time = 1.0 - t;

    vec4 animColor = color;
    animColor.r = color.r * r + color.g * g * time + color.b * b * time;
    animColor.g = color.r * r * time + color.g * g + color.b * b * time;
    animColor.b = color.r * r * time + color.g * g * time + color.b * b;

	gl_FragColor = animColor;
}