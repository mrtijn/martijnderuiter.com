import * as THREE from "three";
import { Texture, LinearFilter } from "three";
export class Scene {
  perspective = 70;
  callbacks: Function[] = [];
  container: HTMLCanvasElement;
  scene: THREE.Scene;
  renderer: THREE.WebGLRenderer;
  camera: THREE.Camera;
  options: any;
  constructor(el: HTMLCanvasElement, opts?: {}) {
    this.container = el;
    this.scene = new THREE.Scene();

    const defaultOptions = {
      camera: {
        near: 0.1,
        far: 2000,
        fov: 50
      }
    };

    this.options = {
      ...defaultOptions,
      ...opts
    };

    this.renderer = this.createRenderer();
    this.setupLights();
    this.camera = this.setupCamera();

    this.update();
  }

  createRenderer() {
    const renderer = new THREE.WebGLRenderer({
      canvas: this.container,
      alpha: true
    });

    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(window.devicePixelRatio);
    return renderer;
  }

  setupLights() {
    const ambientlight = new THREE.AmbientLight(0xffffff, 2);
    this.scene.add(ambientlight);
  }

  setupCamera() {
    const camera = new THREE.PerspectiveCamera(
      this.options.camera.fov,
      window.innerWidth / window.innerHeight,
      this.options.camera.near,
      this.options.camera.far
    );

    camera.position.set(0, 0, 800);

    return camera;
  }

  update() {
    requestAnimationFrame(this.update.bind(this));

    this.renderer.render(this.scene, this.camera);

    if (this.callbacks.length) {
      for (let callback of this.callbacks) {
        callback();
      }
    }
  }
}

export const loadTextures = async (images: string[]) => {
  const promises: Promise<THREE.Texture>[] = [];

  for (const image of images) {
    let promise: any = new Promise(resolve => {
      const texture = new THREE.TextureLoader().load(image, resolve);
      texture.generateMipmaps = false;
      texture.minFilter = LinearFilter;
      texture.needsUpdate = true;
      return Texture;
    });
    promises.push(promise);
  }

  return Promise.all<THREE.Texture>(promises);
};

export const vertexShader = `
  varying vec2 vUv;
  void main () {
    vUv = uv;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
  }
`;

export const viewPort = () => {
  return {
    height: window.innerHeight,
    width: window.innerWidth
  };
};

export const calcViewport = () => {
  const { width, height } = viewPort();
  let aspectRatio = width / height;
  return {
    width,
    height,
    aspectRatio
  };
};

export const clamp = function(
  origin: number,
  in_min: number,
  in_max: number,
  out_min: number,
  out_max: number
) {
  return (
    ((origin - in_min) * (out_max - out_min)) / (in_max - in_min) + out_min
  );
};

export const updateResolution = (stage: any) => {
  // stage.renderer.setSize( window.innerWidth, window.innerHeight );
  // stage.camera.aspect = window.innerWidth / window.innerHeight;
  const viewport = calcViewport();
  stage.camera.aspect = viewport.aspectRatio;
  stage.camera.updateProjectionMatrix();
  stage.renderer.setSize(viewport.width, viewport.height);

  // const resolution = {
  //   value: {
  //     x: 0,
  //     y: 0,
  //     z: 0,
  //     w: 0
  //   }
  // };

  // // set aspect ratio
  // let a1; let a2;
  // const imageAspect = texture.image.height / texture.image.width;
  // console.log(imageAspect)
  // if(window.innerHeight/window.innerWidth>imageAspect) {
  //   a1 = (window.innerWidth/window.innerHeight) * imageAspect ;
  //   a2 = 1;
  // } else{
  //   a1 = 1;
  //   a2 = (window.innerHeight/window.innerWidth) / imageAspect;
  // }

  // // resolution.value.x = window.innerWidth;
  // // resolution.value.y = window.innerHeight;
  // resolution.value.z = a1;
  // resolution.value.w = a2;

  //   // update resolution
  // resolution.value.x = stage.renderer.domElement.width;
  // resolution.value.y = stage.renderer.domElement.height;

  // return resolution;
};
