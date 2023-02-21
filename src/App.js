import React, { useRef, useState, Suspense } from 'react';
import { Route, Routes } from 'react-router'
import { BrowserRouter } from 'react-router-dom' //引入react-router
import { Canvas, useFrame } from '@react-three/fiber'
import { Environment, ContactShadows, OrbitControls, PerspectiveCamera } from '@react-three/drei'
// import Car from './model'
import Subway from './Subway'
import Level from './Level1'
import Game from './Game'
import Point from './Map'
import Road from './Road'
import RunningCar from './RunningCar'
import WindingRoad from './WindingRoad'
import RobotArm from './RobotArm'
import MoonPhase from './MoonPhase'

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/"  element={<Subway />}/>
        <Route path="/subway" element={<Subway />} />
        <Route path="/level" element={<Level />} />
        <Route path="/game" element={<Game />} />
        <Route path="/point" element={<Point />} />
        <Route path="/road" element={<Road />} />
        <Route path="/runningCar" element={<RunningCar />} />
        <Route path="/windingRoad" element={<WindingRoad />} />
        <Route path="/robotArm" element={<RobotArm />} />
        <Route path="/moonPhase" element={<MoonPhase />} />

      </Routes>
    </BrowserRouter>
    // <div className="App">
    //   <Canvas gl={{ toneMappingExposure: 0.7 }}>
    //     <Suspense fallback={null}>
    //       <Environment files="/quattro_canti_2k.hdr" ground={{ height: 38, radius: 130 }} />
    //       <ambientLight intensity={0.03} />
    //       <spotLight angle={1} position={[-80, 200, -100]} intensity={1.5} />
    //       <ContactShadows renderOrder={2} frames={1} resolution={1024} scale={12} blur={2} opacity={0.6} far={100} />
    //       <Car position={[10, 15, -25]} scale={5} />
    //     </Suspense>
    //     <OrbitControls enableZoom={true} enablePan={false} minPolarAngle={0} maxPolarAngle={Math.PI / 2.25} makeDefault />
    //     <PerspectiveCamera makeDefault position={[-30, 100, 120]} fov={35} />
    //   </Canvas>
    // </div>

  )
}

export default App;
