import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React, { useRef, useEffect, useState, Suspense } from 'react';

const App = () => {
    const subwayRef = useRef();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true

    const scene = new THREE.Scene();
    renderer.setClearColor(0xffffff);

    const camera = new THREE.PerspectiveCamera(
        45,
        window.innerWidth / window.innerHeight,
        0.1,
        100
    );

    camera.position.set(0, 10, 15);
    camera.lookAt(scene.position);

    const ambientLight = new THREE.AmbientLight(0xffffff);
    scene.add(ambientLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 3);
    dirLight.position.set(10, 300, -30);
    // dirLight.castShadow = true;
    // dirLight.shadow.mapSize.width = 1024;
    // dirLight.shadow.mapSize.height = 1024;
    // dirLight.shadow.camera.left = -400;
    // dirLight.shadow.camera.right = 350;
    // dirLight.shadow.camera.top = 400;
    // dirLight.shadow.camera.bottom = -300;
    // dirLight.shadow.camera.near = 100;
    // dirLight.shadow.camera.far = 800;
    scene.add(dirLight);
    
    let mixer;
    const loader = new GLTFLoader();
    let model;
    loader.load('/robot_arm_animation.glb', function (glb) {
        model = glb.scene;
        model.scale.set(0.1, 0.1, 0.1)
        model.traverse(function (child) {
            if (child.isMesh) {
                let m = child
                m.receiveShadow = true
                m.castShadow = true
            }
            if (child.isLight) {
                let l = child
                l.castShadow = true
                l.shadow.bias = -0.003
                l.shadow.mapSize.width = 2048
                l.shadow.mapSize.height = 2048
            }
        })
        scene.add(model);
        mixer = new THREE.AnimationMixer(model);
        const clips = glb.animations;
        const clip = THREE.AnimationClip.findByName(clips, "Take 001")
        const action = mixer.clipAction(clip)
        action.play();
    });

    const controls = new OrbitControls(camera, renderer.domElement);
    const clock = new THREE.Clock();
    function animate() {
        mixer?.update(clock.getDelta());
        controls.update(); 
        renderer.render(scene, camera);
    }
    
    useEffect(() => {
        renderer.setAnimationLoop(animate);
        subwayRef.current.appendChild(renderer.domElement)
    }, [])

    return <div className="App">
        <div ref={subwayRef}></div>
    </div>
}
export default App;