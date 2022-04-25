export default `

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;


void main() {
    gl_FragColor = vec4(sin(vPos.x+vTime), sin(vPos.y+vTime), cos(vPos.x*20.), 1.0);
}

`