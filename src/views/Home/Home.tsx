import React, { useState, useEffect } from "react";
import gsap from "gsap";
import style from "./home.module.scss";
import {
  Scene,
  loadTextures,
  updateResolution,
  calcViewport,
  clamp
} from "../../utils/three-utils";
import { fragmentShader, vertexShader as theVertex } from "./home.shader.js";
import * as THREE from "three";

function animateText() {
  gsap.fromTo(
    "h1 > span",
    0.7,
    { x: -30, opacity: 0 },
    { x: 0, opacity: 1, stagger: -0.03 }
  );

  gsap.fromTo(
    "h3 > span",
    0.4,
    { x: -30, y: 10, opacity: 0 },
    { x: 0, y: 0, opacity: 1, stagger: -0.02 }
  );
}
function splitText(text: string) {
  const str = text.split("");
  const result = [];
  for (const char of str) {
    result.push(char !== " " ? char : "\u00A0");
  }
  return result;
}

async function createMesh(stage: Scene) {
  const geometry = new THREE.InstancedBufferGeometry();
  const numPoints = 10;
  const [texture] = await loadTextures(["./img/me.jpg"]);
  // pos
  const positions = new THREE.BufferAttribute(new Float32Array(4 * 3), 3);
  positions.setXYZ(0, -0.5, 0.5, 0.0);
  positions.setXYZ(1, 0.5, 0.5, 0.0);
  positions.setXYZ(2, -0.5, -0.5, 0.0);
  positions.setXYZ(3, 0.5, -0.5, 0.0);
  geometry.addAttribute("position", positions);

  // uvs
  const uvs = new THREE.BufferAttribute(new Float32Array(4 * 2), 2);
  uvs.setXYZ(0, 0.0, 0.0, 0);
  uvs.setXYZ(1, 1.0, 0.0, 0);
  uvs.setXYZ(2, 0.0, 1.0, 0);
  uvs.setXYZ(3, 1.0, 1.0, 0);
  geometry.addAttribute("uv", uvs);

  // index
  geometry.setIndex(
    new THREE.BufferAttribute(new Uint16Array([0, 2, 1, 2, 3, 1]), 1)
  );

  const indices = new Uint16Array(numPoints);
  const offsets = new Float32Array(numPoints * 3);
  const angles = new Float32Array(numPoints);

  for (let i = 0; i < numPoints; i++) {
    offsets[i * 3 + 0] = i % viewSize(stage).width;
    offsets[i * 3 + 1] = Math.floor(i / viewSize(stage).width);

    indices[i] = i;

    angles[i] = Math.random() * Math.PI;
  }

  geometry.addAttribute(
    "pindex",
    new THREE.InstancedBufferAttribute(indices, 1, false)
  );
  geometry.addAttribute(
    "offset",
    new THREE.InstancedBufferAttribute(offsets, 3, false)
  );
  geometry.addAttribute(
    "angle",
    new THREE.InstancedBufferAttribute(angles, 1, false)
  );

  const uniforms = {
    uTime: { value: 0 },
    uRandom: { value: 1.0 },
    uDepth: { value: 2.0 },
    uSize: { value: 0.0 },
    uTextureSize: {
      value: new THREE.Vector2(viewSize(stage).width, viewSize(stage).height)
    },
    uTexture: { value: texture },
    uTouch: { value: null }
  };

  const material = new THREE.RawShaderMaterial({
    uniforms,
    vertexShader: theVertex,
    fragmentShader,
    depthTest: false,
    transparent: true
  });

  const mesh = new THREE.Mesh(geometry, material);
  stage.scene.add(mesh);
}

// async function createMesh(stage: Scene) {
//   const geometry = new THREE.PlaneBufferGeometry(1, 1);
//   const position = new THREE.Vector3(1, 0, 0);
//   let mesh: any;

//   const [texture] = await loadTextures(["./img/me.jpg"]);

//   const uniforms: any = {
//     u_color1: {
//       type: "c",
//       value: new THREE.Color("#040807")
//     },
//     u_color2: {
//       type: "c",
//       value: new THREE.Color("white")
//     },
//     u_resolution: {
//       value: new THREE.Vector4()
//     },
//     u_mouse: { type: "v2", value: new THREE.Vector2() },
//     // u_time: {
//     //   value: this.params.time
//     // },
//     u_progress: {
//       value: new THREE.Vector2(0, 0)
//     },
//     u_texture: {
//       type: "t",
//       value: texture
//     }
//   };

//   document.onmousemove = e => {
//     const viewsize = viewSize(stage);
//     let x = (e.clientX / calcViewport().width) * 2 - 1;
//     let y = -(e.clientY / calcViewport().height) * 2 + 1;

//     uniforms.u_mouse.value.x = x;
//     uniforms.u_mouse.value.y = y;
//     x = clamp(x, -1, 1, -viewsize.width / 2, viewsize.width / 2);

//     y = clamp(y, -1, 1, -viewsize.height / 2, viewsize.height / 2);

//     onPositionUpdate(
//       position.x + e.pageX / 10000,
//       position.y + e.pageY / 10000
//     );
//   };

function viewSize(stage: any) {
  // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

  let distance = stage.camera.position.z;
  let vFov = (stage.camera.fov * Math.PI) / 180;
  let height = 2 * Math.tan(vFov / 2) * distance;
  let width = height * calcViewport().aspectRatio;
  return { width, height, vFov };
}

//   function onPositionUpdate(x: number, y: number): any {
//     // compute offset
//     let offset = mesh.position
//       .clone()
//       .sub(new THREE.Vector3(x, y, 0)) // velocity
//       .multiplyScalar(-0.15);
//     uniforms.u_progress.value = offset;
//     // console.log(offset);
//   }

//   const material = new THREE.ShaderMaterial({
//     vertexShader: theVertex,
//     fragmentShader,
//     uniforms,
//     defines: {
//       PR: window.devicePixelRatio.toFixed(1)
//     }
//   });

//   updateResolution(stage);
//   window.addEventListener("resize", () => updateResolution(stage));

//   let imageRatio = texture.image.naturalWidth / texture.image.naturalHeight;

//   mesh = new THREE.Mesh(geometry, material);
//   mesh.scale.copy(new THREE.Vector3(imageRatio * 1.2, 1.2, 1));
//   mesh.position.copy(position);
//   stage.scene.add(mesh);
// }

const Home = () => {
  const [state] = useState({
    title: "Martijn de Ruiter",
    subtitle: "Front-end Developer based in the Netherlands"
  });

  useEffect(() => {
    animateText();
    const stage = new Scene(
      document.getElementById("scene") as HTMLCanvasElement
    );
    createMesh(stage);
  });

  return (
    <div>
      <canvas id="scene"></canvas>
      <div className={`fullscreen ${style.home}`}>
        <h1>
          {splitText(state.title).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h1>
        <h3>
          {splitText(state.subtitle).map((c, i) => (
            <span key={i}>{c}</span>
          ))}
        </h3>
      </div>
    </div>
  );
};

export default Home;
