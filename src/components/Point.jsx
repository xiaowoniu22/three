import { useThree, useFrame, Canvas } from '@react-three/fiber'
import { useMemo, useRef } from "react";
import { useSpring } from '@react-spring/three'
import { BufferAttribute } from "three";
import * as THREE from 'three'
import vertexShader from './shaders/vertexShader.js';
import fragmentShader from './shaders/pointFragmentShader.js';



export default function Level() {
  const { camera } = useThree()
  const mesh = useRef();
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
    uTime: { value: 0.0 },
    u_resolution: { value: { x: window.innerWidth, y: window.innerHeight } },
    u_color: { value: [Math.random(), Math.random(), Math.random(), 1] },
    xy: { value: [2 * Math.random() - 1, 2 * Math.random() - 1,] },
    bias: { value: Math.random() }
  }
  useFrame((state) => {
    const { clock } = state;
    // mesh.current.material.uniforms.uTime.value = clock.getElapsedTime();
  });
  function BufferPoints({ count = 10000 }) {
    const points = useMemo(() => {
      const p = new Array(count).fill(0).map((v) => (0.5 - Math.random()) * 7.5);
      return new BufferAttribute(new Float32Array(p), 3);
    }, [count]);
    const colors = useMemo(() => {
      const c = new Array(count).fill(0).map((v) => Math.random());
      return new BufferAttribute(new Float32Array(c), 3);
    });
    console.log(1111, colors);
    return (
      <points>
        <bufferGeometry>
          <bufferAttribute attach={"attributes-position"} {...points} />
          <bufferAttribute attach={"attributes-color"} {...colors} />
        </bufferGeometry>
        {/* <boxGeometry args={[1, 1, 32, 32]}/> */}
        {/* <pointsMaterial
          size={0.1}
          threshold={0.1}
          color={0xff00ff}
          sizeAttenuation={true}
        /> */}
              {/* <pointsMaterial sizeAttenuation attach="material" color={"#11529c'"} depthWrite={false} size={100} /> */}

        <shaderMaterial
          fragmentShader={fragmentShader}
          vertexShader={vertexShader}
          uniforms={uniforms}
        />
      </points>
    );
  }
  return <mesh ref={mesh} position={[1, 0, 1]}  >
    <BufferPoints />
  </mesh>
}