import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, PresentationControls, PerspectiveCamera } from '@react-three/drei'
import Level from './components/level'
import Sudo from './components/Sudo'
import Cactus from './components/Cactus'
import Camera from './components/Camera'
import Pyramid from './components/Pyramid'
import Icon from './components/Icon'
// import Car from './model'

const App = () => {
  return (
    <div className="App">
      <Canvas>
        <Suspense fallback={null}>
          {/* <color attach="background" args={['#e0b7ff']} /> */}

          <PresentationControls
            global={true} // Spin globally or by dragging the model
            cursor={true} // Whether to toggle cursor style on drag
            snap={false} // Snap-back to center (can also be a spring config)
            speed={1} // Speed factor
            zoom={0.8} // Zoom factor when half the polar-max is reached
            rotation={[0, -Math.PI / 4, 0]} // Default rotation
            polar={[0, Math.PI / 4]} // Vertical limits
            azimuth={[-Math.PI / 4, Math.PI / 4]} // Horizontal limits
            config={{ mass: 1, tension: 170, friction: 26 }} // Spring config
          >
            <group position-y={-0.75} scale={1.8}>
              <Level />
              <Sudo />
              <Cactus />
              <Camera />
              <Pyramid />
              <Icon />
              {/* <Car /> */}
            </group>
          </PresentationControls>
        </Suspense>
      </Canvas>
    </div>

  )
}

export default App;
