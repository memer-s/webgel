import WebGel, { Vec2 } from "./webgel/webgel";
import { Camera, Vec3, Cube } from "./webgel/webgel";
import { normalMaterial, standardMaterial } from "./webgel/material";
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
  if (fps)
    if (webgel)
      fps.innerText = webgel.fetchCurrentFPS().toPrecision(4) + " FPS"
}, 250)



let rang: HTMLInputElement = document.getElementsByTagName("input")[0];
rang.addEventListener("input", () => {
  // webgel.updateUniform("random", parseFloat(rang.value))
})


let camera = new Camera(new Vec3(0, 0, -6))
let webgel = new WebGel(canvas);
let renderer = new Renderer(webgel.glInstance);
webgel.useRenderer(renderer);

let cube = new Cube(new Vec3(-5, 0, 0), new Vec2(10, 1), 100)
// let cube2 = new Cube(new Vec3(-2,2,0), new Vec2(1,1), 2)

let fuckymaterial = new normalMaterial()
cube.setMaterial(fuckymaterial);
// cube2.setMaterial(new standardMaterial)
renderer.addObject(cube);

// webgel.addUniform("random", new Uniform("float", Math.random()))
renderer.useCamera(camera)

let time = 0;
webgel.loop((dt: number) => {
  fuckymaterial.updateUniform("time", time);
  // cube.rotate.x(0.001)
  time += dt;
});

requestAnimationFrame(renderer.render)