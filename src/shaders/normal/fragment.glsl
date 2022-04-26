export default `

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;


void main() {
    gl_FragColor = vec4(sin(vPos.x+vTime+1.58)/2.+0.5, sin(vPos.y+vTime)/2.+0.5, sin(2.0*vTime+vPos.x)/2.+0.5, 1.0);
    // gl_FragColor = vec4(vPos, vPos, vPos, 1.0);
}

`