import WebGel, { Uniform, Vec2 } from "./webgel/webgel";
import { Camera, Vec3, Cube } from "./webgel/webgel";
import './style.css';
//@ts-ignore
import vsSource from './vertex.glsl'
//@ts-ignore
import fsSource from './fragment.glsl'
// import CodeMirror from 'codemirror';
// import './../node_modules/codemirror/lib/codemirror.css'
// import './../node_modules/codemirror/mode/clike/clike'

{
  const cube = new Cube(new Vec3(0,0,0), new Vec2(2,2), 1)
  console.log(cube.getVertices());
  
}

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

// let cm = codemirror(document.body, {
//   value: fsSource,
//   theme: "clike"
// })

let rang: HTMLInputElement = document.getElementsByTagName("input")[0];
rang.addEventListener("input", () => {
  webgel.updateUniform("random", parseFloat(rang.value))
})

let camera = new Camera(new Vec3(0,0,-6))
let webgel = new WebGel(canvas, vsSource, fsSource);
webgel.addUniform("random", new Uniform("float", Math.random()))
webgel.useCamera(camera)

webgel.loop((dt: number) => {
  
});