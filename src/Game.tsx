import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, PresentationControls, OrbitControls } from '@react-three/drei'
import { Physics, Debug } from '@react-three/rapier'
import { KeyboardControls } from '@react-three/drei'
import { Perf } from 'r3f-perf';
import Game from './components/Game'
import Light from './components/Light'
import Interface from './components/Interface'
import useGame from './stores/useGame.js'
import Effects from './Effects.js'
import './components/style.css'


const App = () => {
  const blocksCount = useGame((state) => state.blocksCount)
  const blocksSeed = useGame(state => state.blocksSeed)
  return (
    <div className="App">
      <KeyboardControls map={[
        { name: 'forward', keys: ['ArrowUp', 'KeyW'] },
        { name: 'backward', keys: ['ArrowDown', 'KeyS'] },
        { name: 'leftward', keys: ['ArrowLeft', 'KeyA'] },
        { name: 'rightward', keys: ['ArrowRight', 'KeyD'] },
        { name: 'jump', keys: ['Space'] },
      ]}>
        <Canvas shadows>
          <Perf />
          <color args={['#bdedfc']} attach="background" />
          <Physics>
            {/* <Debug /> */}
            {/* <OrbitControls makeDefault /> */}
            <Light />
            {/* <Suspense fallback={null}>
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
            > */}
            <Game count={blocksCount} seed={blocksSeed} />
            {/* </PresentationControls>
          </Suspense> */}
          </Physics>
          <Effects />
        </Canvas>
        <Interface />
      </KeyboardControls>
    </div>

  )
}

export default App;
