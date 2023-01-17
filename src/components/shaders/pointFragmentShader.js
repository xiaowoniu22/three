//fragmentShdaer字符串
const fragmentShader =/*glsl*/ `
#ifdef GL_ES
precision highp float;
#endif
varying vec4 u_color;

void main() { 
    float r = distance(gl_PointCoord, vec2(0.5, 0.5));
    if(r < 0.5){
        gl_FragColor = u_color;
    }else {
        discard;
    }
}
`;
export default fragmentShader;

 