import React, { useRef, useState, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber'
export default function Light() {
    const light = useRef();
    useFrame((state) => {

        light.current.position.z = state.camera.position.z + 1 - 4 
        light.current.target.position.z = state.camera.position.z - 4
        light.current.target.updateMatrixWorld()
    })
    return <>
        <ambientLight intensity={0.5} />
        {/* <pointLight position={[10, 10, 10]} /> */}
        <directionalLight
            ref={light}
            castShadow
            position={[4, 4, 1]}
            intensity={1.5}
            shadow-mapSize={[1024, 1024]}
            shadow-camera-near={1}
            shadow-camera-far={10}
            shadow-camera-top={10}
            shadow-camera-right={10}
            shadow-camera-bottom={- 10}
            shadow-camera-left={-10}
        />
    </>
}