import { useEffect } from 'react'
import { useGLTF } from '@react-three/drei'
import { useSpring, a } from '@react-spring/three'

export default function Icon() {
  const { nodes } = useGLTF('/level-react-draco.glb')
  const [springs, api] = useSpring(() => ({
    rotation: [0.8, 1.1, -0.4],
    position: [-0.79, 1.3, 0.62],
    config: { mass: 2, tension: 200 },
  }))
  useEffect(() => {
    let timeout
    let rotationX = 0.8;
    const bounce = () => {
    rotationX += 0.2;
      api.start({ rotation: [rotationX, 1.1, -0.4] })
      timeout = setTimeout(bounce, 1.5 * 100)
    }
    bounce()
    return () => clearTimeout(timeout)
  }, [])
  return (
    <a.mesh geometry={nodes.React.geometry} material={nodes.React.material} {...springs}>
    </a.mesh>
  )
}
