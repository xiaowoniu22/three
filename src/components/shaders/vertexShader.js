//vertexShader.js
const vertexShader = /*glsl */`
attribute vec4 color;
varying vec2 vUv;
varying vec4 u_color;

void main() {
  vUv = uv;
  u_color = color;
  vec4 projectedPosition = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
  
  gl_PointSize = 50.0;
  gl_Position = projectedPosition;
}
`;
export default vertexShader;