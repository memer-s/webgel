import WebGel, { Uniform } from "./webgel/webgel";
import { Camera, Vec3 } from "./webgel/webgel";
import './style.css';
// import CodeMirror from 'codemirror';
// import './../node_modules/codemirror/lib/codemirror.css'
// import './../node_modules/codemirror/mode/clike/clike'

let canvas: any = document.getElementById("c");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

window.addEventListener("resize", () => {
  canvas.height = window.innerHeight;
  canvas.width = window.innerWidth;
})

const fps = document.getElementById("fps");

setInterval(() => {
  if(fps)
    if(webgel)
      fps.innerText = webgel.fetchCurrentFPS().toPrecision(4)+" FPS"
}, 250)

const vsSource = `
  attribute vec4 aVertexPosition;
  attribute vec4 aVertexColor;

  varying lowp vec4 vColor;

  uniform float time;
  uniform float random;
  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  vec4 pos() {
    return vec4(aVertexPosition.x+random*0.01, aVertexPosition.y+sin(time*random+aVertexPosition.x), aVertexPosition.z, 1);
  }

  void main() {
    vColor = aVertexColor;
    gl_Position = uProjectionMatrix * uModelViewMatrix * pos();
  }
`;

const fsSource = `
  varying lowp vec4 vColor;

  void main() {
    gl_FragColor = vColor;
  }
`;

// let cm = codemirror(document.body, {
//   value: fsSource,
//   theme: "clike"
// })

let rang: HTMLElement = <HTMLInputElement> document.getElementById("rang")
rang.addEventListener("input", () => {
  webgel.updateUniform("random", document.getElementById("rang").value)
  console.log(document.getElementById("rang").value);
})

let camera = new Camera(new Vec3(0,0,-6))
let webgel = new WebGel(canvas, vsSource, fsSource);
webgel.addUniform("random", new Uniform("float", Math.random()))
webgel.useCamera(camera)

webgel.loop((dt: number) => {

});