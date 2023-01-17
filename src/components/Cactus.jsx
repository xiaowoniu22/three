import { MeshWobbleMaterial, useGLTF } from '@react-three/drei'

export default function Cactus() {
    const { nodes, materials } = useGLTF('/level-react-draco.glb')
    return (
      <mesh geometry={nodes.Cactus.geometry} material={nodes.Cactus.material} position={[-0.42, 0.51, -0.62]} rotation={[Math.PI / 2, 0, 0]}>
        <MeshWobbleMaterial factor={0.4} attach="material" distort={0.5}/>
      </mesh>
    )
  }