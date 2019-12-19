import * as THREE from "three";
// import Stats from "./jsm/libs/stats.module.js";
var renderer, scene, camera;
var particleSystem, uniforms, geometry;
var particles = 100;
let mouseX = 0;
let mouseY = 0;

export default () => {
  camera = new THREE.PerspectiveCamera(
    40,
    window.innerWidth / window.innerHeight,
    1,
    10000
  );
  camera.position.z = 300;
  scene = new THREE.Scene();
  uniforms = {
    pointColor: {
      value: new THREE.Color("blue")
    }
  };
  var shaderMaterial = new THREE.ShaderMaterial({
    uniforms: uniforms,
    vertexShader: vertexShader,
    fragmentShader: fragmentShader,
    blending: THREE.AdditiveBlending,
    depthTest: false,
    transparent: true
    // vertexColors: true
  });
  var radius = 200;
  geometry = new THREE.BufferGeometry();
  var positions = [];
  var colors = [];
  var sizes = [];
  var color = new THREE.Color("blue");
  for (var i = 0; i < particles; i++) {
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    positions.push((Math.random() * 2 - 1) * radius);
    // color.setHSL(i / particles, 1.0, 0.5);
    colors.push(color.r, color.g, color.b);
    sizes.push(10);
  }
  geometry.setAttribute(
    "position",
    new THREE.Float32BufferAttribute(positions, 3)
  );
  geometry.setAttribute("color", new THREE.Float32BufferAttribute(colors, 3));
  geometry.setAttribute("size", new THREE.Float32BufferAttribute(sizes, 1));
  particleSystem = new THREE.Points(geometry, shaderMaterial);
  scene.add(particleSystem);
  renderer = new THREE.WebGLRenderer();
  renderer.setPixelRatio(window.devicePixelRatio);
  renderer.setSize(window.innerWidth, window.innerHeight);
  var container = document.getElementById("container");
  container.appendChild(renderer.domElement);
  // stats = new Stats();
  // container.appendChild(stats.dom);
  //
  window.addEventListener("resize", onWindowResize, false);

  animate();
};
function onWindowResize() {
  camera.aspect = window.innerWidth / window.innerHeight;
  camera.updateProjectionMatrix();
  renderer.setSize(window.innerWidth, window.innerHeight);
}
function animate() {
  requestAnimationFrame(animate);
  render();
  // stats.update();
}

document.onmousemove = e => {
  // const viewsize = viewSize(stage);
  let x = (e.clientX / window.outerWidth) * 2 - 1;
  let y = -(e.clientY / window.outerHeight) * 2 + 1;
  mouseX = x;
  mouseY = y;
};

function render() {
  // var time = Date.now() * 0.005;
  //particleSystem.rotation.z = 0.01 * time;
  const radius = 200;
  var positions = geometry.attributes.position.array;
  var x, y, z, index;
  x = mouseX * 200;
  y = mouseY * 200;
  z = index = 0;
  for (var i = 0; i < particles; i++) {
    positions[index++] = x;
    positions[index++] = y;
    positions[index++] = z;
    x = mouseX * 500 * Math.random();
    y = mouseY * 500 * Math.random();
    z = 1;
  }
  geometry.attributes.position.needsUpdate = true;
  renderer.render(scene, camera);
}

const vertexShader = `
			attribute float size;
			// varying vec3 vColor;
			void main() {
				// vColor = color;
				vec4 mvPosition = modelViewMatrix * vec4( position, 1.0 );
				gl_PointSize = 4.;
				gl_Position = projectionMatrix * mvPosition;
			}
`;

const fragmentShader = `
			uniform vec3 pointColor;
			// varying vec3 vColor;
			void main() {
				gl_FragColor = vec4( pointColor, 1.0 );
				// gl_FragColor = gl_FragColor * texture2D( pointTexture, gl_PointCoord );
			}
		`;
