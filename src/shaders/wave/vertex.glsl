export default `

attribute vec4 vPosition;
attribute vec4 vertexColor;

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;
varying lowp float vSpeed;

uniform float time;
uniform float speed;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

vec4 pos() {
    return vec4(
        vPosition.x,
        vPosition.y+1.*sin(speed*time+vPosition.x+vPosition.z),
        vPosition.z,
    1);
}

void main() {
    vPos = pos();
    vColor = vertexColor;
    vTime = time;
    vSpeed = 1.;
    gl_Position = uProjectionMatrix * uModelViewMatrix * pos();
}

`