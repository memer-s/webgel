import OBJLoader from "./webgel/objParser";
// //@ts-ignore
import obj from './untitled.obj'
// let objLoader = new OBJLoader();
// objLoader.load(obj, (d) => {
//   console.log(d.vertices);
//   console.log(d.indices);
//   console.log(d.textureCoordinates);
  
// })





import WebGel from "./webgel/webgel";
import {Plane, Camera, Vec3, Vec2, Cube, Custom} from './webgel/objects'
import { normalMaterial, shaderMaterial, standardMaterial, textureMaterial } from "./webgel/material";
import { Renderer } from "./webgel/renderer";
import Debug from "./webgel/debug";
import './style.css';
import texture from './poggers.jpg'

//@ts-ignore
import vertex from './shaders/testing/vertex.glsl'
//@ts-ignore
import fragment from './shaders/testing/fragment.glsl'

let canvas: any = document.getElementById("c");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

let deb = new Debug("Debug 1");
let fps = deb.addDisplay("FPS: ")

setInterval(() => {
  if (fps)
    if (webgel)
      fps(webgel.fetchCurrentFPS().toPrecision(4))
}, 100)

deb.addCheckbox("Wireframe:", (e) => {
  e.target.checked ? renderer.renderMethod = webgel.glInstance.LINES : renderer.renderMethod = webgel.glInstance.TRIANGLES;
})

let x = 1;
deb.addRange("Speed:", (e) => {
  x = e.target.value;
  fuckymaterial.updateUniform("speed", x)  
}, 0, 10, 0.003, 1);

let rotSpeed = "0.001";
deb.addRange("Rotation speed:", (e) => {
  rotSpeed = e.target.value;
}, 0, 0.5, 0.00001, 0.000001);

deb.addRange("plane def:", (e) => {
  plane.remove()
  plane = new Plane(new Vec3(0, -3, -6), new Vec2(10, 10), e.target.value)
  plane.setMaterial(fuckymaterial);
  renderer.addObject(plane);
}, 1, 100, 1, 1);

deb.addButton("Remove fuckywucky cube", () => {
  cube.remove()
})

deb.render(document.body)

let camera = new Camera(new Vec3(0,-3,-6))
let webgel = new WebGel(canvas);
let renderer = new Renderer(webgel.glInstance);
webgel.useRenderer(renderer);

let modelLoader = new OBJLoader();

let plane = new Plane(new Vec3(0, -3, -6), new Vec2(10, 10), 5)
let cube = new Cube(new Vec3(0,0,-10),1);


let fuckymaterial = new shaderMaterial(vertex, fragment, "testing", [
  {type: "float", uniformName: "time", value: 0}, 
  {type: "float", uniformName: "speed", value: 1}
])
let lessfuckymaterial = new textureMaterial(texture);
//@ts-ignore
let model;
modelLoader.load(obj, (data) => {
  // renderer.renderMethod = webgel.glInstance.TRIANGLE_FAN
  model = new Custom(new Vec3(0,-3,-10), data)
  model.setMaterial(new standardMaterial());
  console.log(data);
  renderer.addObject(model)
})


plane.setMaterial(fuckymaterial);
cube.setMaterial(lessfuckymaterial);

// renderer.addObject(plane);
// renderer.addObject(cube);

renderer.useCamera(camera)


let time = 0;
webgel.loop((dt: number) => {
  fuckymaterial.updateUniform("time", time);
  model.rotate.y(parseFloat(rotSpeed)*0.2)
  model.rotate.x(parseFloat(rotSpeed)*0.1)
  model.rotate.z(parseFloat(rotSpeed)*0.01)
  // plane.rotate.y(parseFloat(rotSpeed)*0.1)
  cube.move.y(Math.sin(time*2)*0.003)
  plane.rotate.y(0.001)
  // cube.rotate.x(0.001)
  time += dt;
});

requestAnimationFrame(renderer.render)
