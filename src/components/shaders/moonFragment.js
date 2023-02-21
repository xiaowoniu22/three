//fragmentShdaer字符串
const fragmentShader =/*glsl*/ `
#ifdef GL_ES
precision highp float;
#endif

uniform sampler2D textureMap;
uniform sampler2D normalMap;
    
varying vec2 vUv;
varying mat3 tbn;
varying vec3 vLightVector;

void main() { 
    vec3 normalCoordinate = texture2D(normalMap, vUv).xyz * 2.0 - 1.0;

    vec3 normal = normalize(tbn * normalCoordinate.rgb);
       
    float intensity = max(0.07, dot(normal, vLightVector));
    vec4 lighting = vec4(intensity, intensity, intensity, 1.0);

    gl_FragColor = texture2D(textureMap, vUv) * lighting;
}
`;
export default fragmentShader;

 