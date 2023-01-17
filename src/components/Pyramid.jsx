import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'

export default function Pyramid() {
  const { nodes } = useGLTF('/level-react-draco.glb')
  const [spring, api] = useSpring(() => ({ rotation: [0, 0, 0], config: { mass: 5, tension: 200 } }), [])
  useEffect(() => {
    let timeout
    const rotate = () => {
      api.start({ rotation: [(Math.random() - 0.5) * Math.PI * 3, 0, (Math.random() - 0.5) * Math.PI * 3] })
      timeout = setTimeout(rotate, (0.5 + Math.random() * 2) * 1000)
    }
    rotate()
    return () =>clearTimeout(timeout)
  }, [])
  return (
    <a.mesh geometry={nodes.Pyramid.geometry} material={nodes.Pyramid.material} position={[-0.8, 1.33, 0.25]} {...spring}>
    </a.mesh>
  )
}
