// var THREE = require('three');

let animation = () => {
  // console.log(this);
  let init = () => {
    let root = new THREERoot({
      createCameraControls : !true,
      antialias: (window.devicePixelRatio === 1),
      fov: 60
    });
    console.log(root);
    root.renderer.setClearColor(0x000000);
    root.renderer.setPixelRatio(window.devicePixelRatio || 1);
    root.camera.position.set(0,0,600);

    let textAnimation = createTextAnimation();
    root.scene.add(textAnimation);

    let light = new THREE.DirectionalLight();
    light.position.set(0,0,1);
    root.scene.add(light);
  };

  let THREERoot = function(params) {
    params = utils.extend({
      fov:60,
      zNear:10,
      zFar:100000,

      createCameraControls:true
    }, params);

    this.renderer = new THREE.WebGLRenderer({
      antialias:params.antialias
    });
    this.renderer.setPixelRatio(Math.min(2, window.devicePixelRatio || 1));
    document.getElementById('canvas').appendChild(this.renderer.domElement);

    this.camera = new THREE.PerspectiveCamera(
      params.fov,
      window.innerWidth / window.innerHeight,
      params.zNear,
      params.zfar
    );
    this.scene = new THREE.Scene();
  };
  THREERoot.prototype = {
    tick: function() {
      this.update();
      this.render();
      requestAnimationFrame(this.tick);
    },
    update: function() {
      this.controls && this.controls.update();
    },
    render: function() {
      this.renderer.render(this.scene, this.camera);
    },
    resize: function() {
      this.camera.aspect = window.innerWidth / window.innerHeight;
      this.camera.updateProjectionMatrix();

      this.renderer.setSize(window.innerWidth, window.innerHeight);
    }
  };
  let createTextAnimation = function() {
    let geometry = generateTextGeometry('MARTIJNDERUITER.NL',{
      size: 40,
      height: 12,
      font: utils.loadFont(),
      fontName : "Helvetiker",
      weight: 'bold',
      style: 'bold',
      curveSegments: 30,
      bevelSize: 2,
      bevelThickness: 2,
      bevelEnabled: true,
      anchor: {x: 0.5, y: 0.5, z: 0.0}
    })

    THREE.BAS.Utils.tessellateRepeat(geometry,1.0,2);
    THREE.BAS.Utils.seperateFaces(geometry);
    return geometry;
  };

  function generateTextGeometry(text, params) {
    // console.log(THREE);
    var geometry = new THREE.TextGeometry(text, params);

    geometry.computeBoundingBox();

    var size = geometry.boundingBox.size();
    var anchorX = size.x * -params.anchor.x;
    var anchorY = size.y * -params.anchor.y;
    var anchorZ = size.z * -params.anchor.z;
    var matrix = new THREE.Matrix4().makeTranslation(anchorX, anchorY, anchorZ);

    geometry.applyMatrix(matrix);

    return geometry;
  }
  // UTILS
  let utils =  {
    extend:function(dst, src) {
      for (var key in src) {
        dst[key] = src[key];
      }

      return dst;
    },
    randSign: function() {
      return Math.random() > 0.5 ? 1 : -1;
    },
    ease:function(ease, t, b, c, d) {
      return b + ease.getRatio(t / d) * c;
    },
    loadFont: function(){
      var loader = new THREE.FontLoader();
      loader.load( '/assets/fonts/helvetikr.json', function ( response ) {
        return response;
      } );
    },
    // mapEase:function(ease, v, x1, y1, x2, y2) {
    //   var t = v;
    //   var b = x2;
    //   var c = y2 - x2;
    //   var d = y1 - x1;
    //
    //   return utils.ease(ease, t, b, c, d);
    // },
    fibSpherePoint: (function() {
      var v = {x:0, y:0, z:0};
      var G = Math.PI * (3 - Math.sqrt(5));

      return function(i, n, radius) {
        var step = 2.0 / n;
        var r, phi;

        v.y = i * step - 1 + (step * 0.5);
        r = Math.sqrt(1 - v.y * v.y);
        phi = i * G;
        v.x = Math.cos(phi) * r;
        v.z = Math.sin(phi) * r;

        radius = radius || 1;

        v.x *= radius;
        v.y *= radius;
        v.z *= radius;

        return v;
      }
    })()
  }

  window.onload = init();
}


export default animation;
