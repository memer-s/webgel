export default `

varying lowp vec3 c;

void main() {
    gl_FragColor = vec4(c.x, c.y, c.z, 1.0);
    // gl_FragColor = vec4(vPos, vPos, vPos, 1.0);
}

`