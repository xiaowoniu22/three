//fragmentShdaer字符串
const fragmentShader =/*glsl*/ `
#ifdef GL_ES
precision mediump float;
#endif
uniform float u_time;
uniform vec2 u_resolution;

void main() { 
    vec2 st = gl_FragCoord.xy/u_resolution.xy;
    gl_FragColor = vec4(st.x,st.y,0.0,1.0);
}
`;
export default fragmentShader;

 