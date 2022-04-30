export default `

varying lowp vec2 vTextureCoord;
uniform sampler2D uSampler;

void main() {
    gl_FragColor = texture2D(uSampler, vTextureCoord);
    // gl_FragColor = vec4(vPos, vPos, vPos, 1.0);
}

`