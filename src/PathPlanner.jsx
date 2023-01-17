
import React, { useRef } from 'react'
import { useGLTF } from '@react-three/drei'
const App = () => {
    const {nodes, materials} = useGLTF(`./model/suv`)
    return (
        <group position={[-0.58, 0.83, -0.03]} rotation={[Math.PI / 2, 0, 0.47]}>
          <mesh geometry={nodes.Camera.geometry} material={nodes.Camera.material} />
          <mesh geometry={nodes.Camera_1.geometry} material={materials.Lens} />
        </group>
      )
}
export default App;