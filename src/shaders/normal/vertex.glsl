export default `

attribute vec4 vPosition;
attribute vec4 vertexColor;

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;

uniform float time;
uniform float random;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

vec4 pos() {
    return vec4(
        vPosition.x,
        vPosition.y+0.2*sin(time+vPosition.x),
        vPosition.z,
    1);
}

void main() {
    vPos = vPosition;
    vColor = vertexColor;
    vTime = time;
    gl_Position = uProjectionMatrix * uModelViewMatrix * pos();
}

`