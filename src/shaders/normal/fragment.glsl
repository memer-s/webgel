export default `

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;


void main() {
    gl_FragColor = vec4(sin(vPos.x+vTime+1.58), sin(vPos.y+vTime), sin(2.0*vTime+vPos.x), 1.0);
}

`