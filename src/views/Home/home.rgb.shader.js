var glsl = require('glslify');
export const fragmentShader =  glsl(`
    precision mediump float;
    #define PI 3.141592653589793
    uniform vec4 u_resolution;
    uniform vec3 u_color1;
    uniform vec3 u_color2;
    uniform vec2 u_progress;
    uniform vec2 u_mouse;
    uniform sampler2D u_texture;
    varying vec2 vUv;

    vec3 rgbShift(sampler2D texture, vec2 uv, vec2 offset) 
    {
        float r = texture2D(texture,uv + offset).r;
        vec2 gb = texture2D(texture,uv).gb;
        return vec3(r,gb);
    }

    void main() {
        vec2 st = gl_FragCoord.xy / u_resolution.xy;

        vec3 image = rgbShift(u_texture, vUv, u_progress);
        
        gl_FragColor = vec4(image, .2);
    }
`)

export const vertexShader = `
    precision mediump float; 
    varying vec2 vUv;
    uniform vec2 u_progress;

    vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
        float M_PI = 3.1415926535897932384626433832795;
        position.x = position.x + (sin(uv.y * M_PI) * offset.x);
        position.y = position.y + (sin(uv.x * M_PI) * offset.y);
        return position;
    }
    void main () {
        vUv = uv;
        vec3 newPosition = deformationCurve(position, uv, u_progress);
        gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
`;