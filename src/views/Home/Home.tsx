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
  const geometry = new THREE.PlaneBufferGeometry(1, 1, 100, 100);
  const position = new THREE.Vector3(1, 0, 0);
  let mesh: any;

  const [texture] = await loadTextures(["./img/me.jpg"]);

  const uniforms: any = {
    u_color: {
      type: "c",
      value: new THREE.Color("#070e0d")
    },
    u_resolution: {
      value: new THREE.Vector4()
    },
    u_mouse: { type: "v2", value: new THREE.Vector2() },
    // u_time: {
    //   value: this.params.time
    // },
    u_progress: {
      value: new THREE.Vector2(0, 0)
    },
    u_offset: {
      value: new THREE.Vector2(0, 0)
    },
    u_texture: {
      type: "t",
      value: texture
    }
  };

  document.onmousemove = e => {
    const viewsize = viewSize(stage);
    let x = (e.clientX / calcViewport().width) * 2 - 1;
    let y = -(e.clientY / calcViewport().height) * 2 + 1;

    uniforms.u_mouse.value.x = x;
    uniforms.u_mouse.value.y = y;
    x = clamp(x, -1, 1, -viewsize.width / 2, viewsize.width / 2);

    y = clamp(y, -1, 1, -viewsize.height / 2, viewsize.height / 2);

    onPositionUpdate(
      position.x + e.pageX / 10000,
      position.y + e.pageY / 10000
    );
  };

  function viewSize(stage: any) {
    // https://gist.github.com/ayamflow/96a1f554c3f88eef2f9d0024fc42940f

    let distance = stage.camera.position.z;
    let vFov = (stage.camera.fov * Math.PI) / 180;
    let height = 2 * Math.tan(vFov / 2) * distance;
    let width = height * calcViewport().aspectRatio;
    return { width, height, vFov };
  }

  function onPositionUpdate(x: number, y: number): any {
    // compute offset
    let offset = mesh.position
      .clone()
      .sub(new THREE.Vector3(x, y, 0)) // velocity
      .multiplyScalar(-0.15);
    uniforms.u_offset.value = offset;
  }

  const material = new THREE.ShaderMaterial({
    vertexShader: theVertex,
    fragmentShader,
    uniforms,
    defines: {
      PR: window.devicePixelRatio.toFixed(1)
    }
  });

  updateResolution(stage);
  window.addEventListener("resize", () => updateResolution(stage));

  let imageRatio = texture.image.naturalWidth / texture.image.naturalHeight;

  mesh = new THREE.Mesh(geometry, material);
  mesh.scale.copy(new THREE.Vector3(imageRatio * 1.2, 1.2, 1));
  mesh.position.copy(position);

  stage.scene.add(mesh);
}

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
