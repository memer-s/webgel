import WebGel, { Uniform, Vec2 } from "./webgel/webgel";
import { Camera, Vec3, Cube } from "./webgel/webgel";
import { normalMaterial } from "./webgel/material";
import './style.css';
//@ts-ignore
import vsSource from './shaders/normal/vertex.glsl'
//@ts-ignore
import fsSource from './shaders/normal/fragment.glsl'
import { Renderer } from "./webgel/renderer";
// import CodeMirror from 'codemirror';
// import './../node_modules/codemirror/lib/codemirror.css'
// import './../node_modules/codemirror/mode/clike/clike'
// let cm = codemirror(document.body, {
//   value: fsSource,
//   theme: "clike"
// })
let canvas: any = document.getElementById("c");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const fps = document.getElementById("fps");

setInterval(() => {
  if(fps)
    if(webgel)
      fps.innerText = webgel.fetchCurrentFPS().toPrecision(4)+" FPS"
}, 250)



let rang: HTMLInputElement = document.getElementsByTagName("input")[0];
rang.addEventListener("input", () => {
  // webgel.updateUniform("random", parseFloat(rang.value))
})

let camera = new Camera(new Vec3(0,0,-6))
let webgel = new WebGel(canvas);
let renderer = new Renderer(webgel.glInstance);
webgel.useRenderer(renderer);
let cube = new Cube(new Vec3(0,0,0), new Vec2(2,2), 10)
let fuckymaterial = new normalMaterial()
cube.setMaterial(fuckymaterial);
console.log(fuckymaterial.getVsSource);
console.log(fuckymaterial.getVsSource());

renderer.addObject(cube);


// webgel.addUniform("random", new Uniform("float", Math.random()))
renderer.useCamera(camera)

webgel.loop((dt: number) => {
  
});
