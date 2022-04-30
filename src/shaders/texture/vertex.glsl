export default `

attribute vec4 vPosition;
attribute vec2 vTexture;

uniform mat4 uModelViewMatrix;
uniform mat4 uProjectionMatrix;

varying lowp vec2 vTextureCoord;

void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * vPosition;
    vTextureCoord = vTexture;
}

`