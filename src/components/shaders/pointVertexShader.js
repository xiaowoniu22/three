//vertexShader.js
const vertexShader = /*glsl */`
uniform vec2 xy;
uniform float uTime; 
uniform float bias; 
attribute vec3 color;
varying vec3 vColor;
void main() { 
    vColor = color;
    float scale = 0.7 + 0.3 * sin(6.28 * bias + 0.003 * uTime); 
    mat3 m = mat3( scale, 0, 0, 0, scale, 0, xy, 1 ); 
    gl_PointSize = 50.0;
    gl_Position = vec4(m * position, 1); 
}
`;
export default vertexShader;