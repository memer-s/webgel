export default `

attribute vec4 aVertexPosition;
attribute vec4 aVertexColor;

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;

uniform float time;
uniform float random;
uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

vec4 pos() {
    return vec4(
        aVertexPosition.x-1.0,
        aVertexPosition.y+0.2*sin(random*time+aVertexPosition.x)-1.,
        aVertexPosition.z,
    1);
}

void main() {
    vPos = aVertexPosition;
    vColor = aVertexColor;
    vTime = time;
    gl_Position = uProjectionMatrix * uModelViewMatrix * pos();
}

`