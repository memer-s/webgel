export default `

varying lowp vec4 vColor;
varying lowp vec4 vPos;
varying lowp float vTime;
varying lowp float vSpeed;


void main() {
    // gl_FragColor = vec4(sin(vPos.x+vTime*vSpeed+1.58)/2.+0.5, sin(vPos.y+vTime*vSpeed)/2.+0.5, sin(2.0*vTime*vSpeed+vPos.x)/2.+0.5, 1.0);
    gl_FragColor = vec4(sin(vPos.y*9.),sin(vPos.y*9.+(3.141592)/3.0),sin(vPos.y*9.+((3.141592)/3.0)*2.), 1.0);
    // gl_FragColor = vec4(vPos, vPos, vPos, 1.0);
}

`