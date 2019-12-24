import React, { useEffect, useRef, useState } from "react";
import {
  Scene,
  viewPort,
  loadTextures,
  vertexShader
} from "../../../utils/three-utils";
import { PlaneBufferGeometry, Mesh, ShaderMaterial, Vector2 } from "three";
import gsap from "gsap";
import Glide, { Controls } from "@glidejs/glide/dist/glide.modular.esm";
import { SliderDirection } from "./slider.enum";
class Slider {
  slider: Scene;
  index = 0;
  nextIndex = 1;
  duration = 0;
  textures: any = [];
  uniforms = {};
  constructor(el: HTMLCanvasElement) {
    this.slider = new Scene(el);
    this.setup();
  }

  setup() {
    this.createPlane();
  }

  setSliderIndex(direction: SliderDirection) {
    this.setCurrentIndex(direction);
    this.setNextIndex(direction);
  }

  setCurrentIndex(direction: SliderDirection) {
    const len = this.textures.length - 1;
    let newIndex =
      direction === SliderDirection.NEXT ? this.index + 1 : this.index - 1;

    if (direction === SliderDirection.NEXT) {
      this.index = newIndex > len ? 0 : newIndex;
    }
    if (direction === SliderDirection.PREV) {
      this.index = newIndex < 0 ? len : newIndex;
    }
  }

  setNextIndex(direction: SliderDirection) {
    const len = this.textures.length - 1;
    if (direction === SliderDirection.NEXT) {
      this.nextIndex = this.index + 1 > len ? 0 : this.index + 1;
    }
    if (direction === SliderDirection.PREV) {
      this.nextIndex = this.index - 1 < 0 ? len : this.index - 1;
    }
  }

  setDuration(number: number) {
    this.duration = number;
  }

  async loadTextures() {
    const images: string[] = [];
    const imgElements: HTMLImageElement[] = document.querySelectorAll(
      ".slider img"
    ) as any;

    imgElements.forEach(img => images.push(img.src));

    return await loadTextures(images);
  }

  async createPlane() {
    const { width, height } = viewPort();
    const plane: any = new PlaneBufferGeometry(width * 1, height * 1, 100, 50);
    this.textures = await this.loadTextures();
    const currentTexture = this.textures[this.index];
    const nextTexture = this.textures[this.nextIndex];
    this.uniforms = {
      image: {
        value: currentTexture
      },
      nextImage: {
        value: nextTexture
      },
      imageResolution: {
        value: new Vector2(
          currentTexture.image.width,
          currentTexture.image.height
        )
      },
      resolution: {
        type: "v2",
        value: new Vector2(window.innerWidth, window.innerHeight)
      },
      progress: { type: "f", value: 0 }
    };
    const material = new ShaderMaterial({
      uniforms: this.uniforms,
      vertexShader: vertexShader,
      fragmentShader
    });

    // this.slider.callbacks.push(this.update.bind(this));

    const object = new Mesh(plane, material);

    this.slider.scene.add(object);
  }

  slide(direction: SliderDirection) {
    return new Promise(resolve => {
      this.setNextIndex(direction);
      let nextTexture = this.textures[this.nextIndex];
      const duration = this.duration / 1000;
      // @ts-ignore
      this.uniforms.nextImage.value = nextTexture;

      // @ts-ignore
      gsap.to(this.uniforms.progress, duration / 2, {
        value: 1,
        ease: "Expo.easeIn",
        onComplete: () => {
          this.setSliderIndex(direction);
          this.update();

          gsap.fromTo(
            // @ts-ignore
            this.uniforms.progress,
            duration / 2,
            { value: -1, ease: "Expo.easeOut" },
            { value: 0 }
          );
          // this.uniforms.progress.value = 0;

          resolve();
        }
      });
    });
  }

  update() {
    // console.log(this.index, this.nextIndex);
    const currentTexture = this.textures[this.index];
    const nextTexture = this.textures[this.nextIndex];

    // @ts-ignore
    this.uniforms.image.value = currentTexture;
    // @ts-ignore
    this.uniforms.nextImage.value = nextTexture;
    // // @ts-ignore
    // this.uniforms.imageResolution = {
    //   value: new Vector2(
    //     currentTexture.image.width,
    //     currentTexture.image.height
    //   )
    // };
  }
}

const Canvas = (props: any) => {
  const canvasEl = useRef<HTMLCanvasElement>(null);
  const [glide] = useState(
    new Glide(".slider", {
      perView: 1,
      animationDuration: 1000
    })
  );

  useEffect(() => {
    setupSlider();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const setupSlider = () => {
    const el = canvasEl.current as HTMLCanvasElement;
    glide.mount({ Controls });

    const slider = new Slider(el);
    console.log(glide._c);
    slider.setDuration(glide._c.Transition.duration);
    glide.on("run.before", (e: any) => {
      slider.slide(e.direction);
    });
  };

  useEffect(() => {
    console.log(props);
  }, [props]);

  return (
    <div>
      <div className="glide slider">
        <div className="glide__track" data-glide-el="track">
          <ul className="glide__slides">
            <li className="glide__slide">
              <img src="./img/houston.jpg" alt="" />
            </li>
            <li className="glide__slide">
              <img src="./img/bryce.jpg" alt="" />
            </li>
            <li className="glide__slide">
              <img src="./img/clouds.jpg" alt="" />
            </li>
            <li className="glide__slide">
              <img src="./img/lake.jpg" alt="" />
            </li>
          </ul>
        </div>

        <div className="controls" data-glide-el="controls">
          <button data-glide-dir="<">Start</button>
          <button data-glide-dir=">">End</button>
        </div>
      </div>
      <canvas ref={canvasEl} id="scene"></canvas>
    </div>
  );
};

export default Canvas;

const fragmentShader = `
    uniform sampler2D image;
    uniform sampler2D nextImage;
    uniform vec2 imageResolution;
    uniform vec2 resolution;
    uniform float progress;
    varying vec2 vUv;

    void main() {
        vec2 st = gl_FragCoord.xy / resolution.xy;
        vec2 ratio = vec2(
          min((resolution.x / resolution.y) / (imageResolution.x / imageResolution.y), 1.0),
          min((resolution.y / resolution.x) / (imageResolution.y / imageResolution.x), 1.0)
        );

        vec2 uv = vec2(
          vUv.x * ratio.x + (1.0 - ratio.x) * 0.5,
          vUv.y * ratio.y + (1.0 - ratio.y) * 0.5
        );
        float x = progress;
        x = smoothstep(.0,1.0,(x*2.0+vUv.y-1.0));
        vec3 image = texture2D(image, vec2(uv.x, (uv.y + progress))).xyz;
        vec3 nextImage = texture2D(nextImage, vec2(uv.x, (uv.y + (0.0 + progress)))).xyz;
        vec3 final = mix(image, nextImage, x);

        gl_FragColor = vec4(final, 1.0);
    }
`;
