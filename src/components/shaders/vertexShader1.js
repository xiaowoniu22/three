//vertexShader.js
const vertexShader = /*glsl */`
varying vec2 vUv;

void main() {
    gl_PointSize = 1.0; 
    vUv = uv; 
    gl_Position = vec4(position, 1.0);
}
`;
export default vertexShader;