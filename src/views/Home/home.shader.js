var glsl = require("glslify");
export const fragmentShader = glsl(`
    precision mediump float;
    #define PI 3.141592653589793
    uniform vec4 u_resolution;
    uniform vec3 u_color;
    uniform vec2 u_offset;
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

        vec3 image = rgbShift(u_texture, vUv, u_offset);
        vec3 final = mix(u_color, image, vUv.x);
        gl_FragColor = vec4(final, 1.);
    }
`);

export const vertexShader = `
    precision mediump float; 
    varying vec2 vUv;
    uniform vec2 u_offset;
    uniform vec2 u_mouse;
    vec3 deformationCurve(vec3 position, vec2 uv, vec2 offset) {
        float M_PI = 3.1415926535897932384626433832795;
        position.x = position.x + (sin(vUv.y * M_PI) * (offset.x / 10.));
        position.y = position.y + (sin(vUv.x * M_PI) * (offset.y / 10.));
        return position;
    }

   
    void main () {
        vUv = uv;
        vec3 newPosition = deformationCurve(position, uv, u_offset * 10.);
        vec3 transformed = vec3(position);
        transformed.x = position.x + sin(position.y*10.0)*u_mouse.x;
        transformed.y = position.y + sin(position.y + u_mouse.y);
        gl_Position = projectionMatrix * modelViewMatrix  * vec4(newPosition, .8);
    }
`;
