import { useThree, useFrame, Canvas } from '@react-three/fiber'
import { useMemo, useRef } from "react";
import { useGLTF } from '@react-three/drei'
import { useSpring } from '@react-spring/three'
import vertexShader from './shaders/vertexShader1.js';
import fragmentShader from './shaders/fragmentShader2.js';



export default function Level() {
  const { nodes } = useGLTF('/level-react-draco.glb')
  const { camera } = useThree()
  const mesh = useRef();
  console.log(1111,Canvas);
  useSpring(
    () => ({
      from: { y: camera.position.y + 5 },
      to: { y: camera.position.y },
      config: { friction: 100 },
      onChange: ({ value }) => ((camera.position.y = value.y), camera.lookAt(0, 0, 0)),
    }),
    [],
  )
  const uniforms = {
    rows: { value: 16 },
    u_time: {value: 0.0},
    u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
  }
  useFrame((state) => {
    const { clock } = state;
    // mesh.current.material.uniforms.u_time.value = clock.getElapsedTime();
  });
  console.log(1111, nodes.Level);
  return <mesh geometry={nodes.Level.geometry} material={nodes.Level.material} position={[-0.38, 0.69, 0.62]} rotation={[Math.PI / 2, -Math.PI / 9, 0]} />
  // return <mesh ref={mesh} position={[1, 0, 1]} rotation={[Math.PI / 8, 0, 0]} scale={4}>
  // <planeGeometry args={[1, 1, 32, 32]}/>
  // <shaderMaterial
  //   fragmentShader={fragmentShader}
  //   vertexShader={vertexShader}
  //   uniforms={uniforms}
  //   // wireframe
  // />
  // </mesh>
}