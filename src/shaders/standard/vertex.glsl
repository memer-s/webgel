export default `

attribute vec4 vPosition;

uniform lowp vec3 color;

varying vec3 c;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

void main() {
    c = color;
    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;
}

`