import WebGel from "./webgel/webgel";
import './style.css';
let canvas: any = document.getElementById("c");
canvas.height = window.innerHeight;
canvas.width = window.innerWidth;

const vsSource = `
  attribute vec4 aVertexPosition;

  uniform mat4 uModelViewMatrix;
  uniform mat4 uProjectionMatrix;

  void main() {
    gl_Position = uProjectionMatrix * uModelViewMatrix * aVertexPosition;
  }
`;

const fsSource = `
  void main() {
    gl_FragColor = vec4(1.0, 1.0, 1.0, 1.0);
  }
`;

let webgl = new WebGel(canvas, vsSource, fsSource);