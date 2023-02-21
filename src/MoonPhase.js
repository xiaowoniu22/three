import * as THREE from 'three';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import React, { useRef, useEffect, useState, Suspense } from 'react';
import vertexShader from './components/shaders/moonVertex.js';
import fragmentShader from './components/shaders/moonFragment.js';

const App = () => {
    const subwayRef = useRef();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.physicallyCorrectLights = true

    const scene = new THREE.Scene();
    renderer.setClearColor(0x000000);

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
    scene.add(dirLight);

    var light = {
        speed: 0.2, //单位是度
        distance: 1000,
        position: new THREE.Vector3(0, 0, 0),
        orbit: function (center, time) {
            this.position.x =
                (center.x + this.distance) * Math.sin(time * -this.speed);

            this.position.z =
                (center.z + this.distance) * Math.cos(time * this.speed);
        }
    };

    const moon = new THREE.SphereGeometry(4, 50, 50);
    var loader = new THREE.TextureLoader();
    var textureMap = loader.load('moon_anorthositic_crust_albedo.jpg');
    var normalMap = loader.load('moon_anorthositic_crust_normal.jpg');
    const shaderMaterial = new THREE.ShaderMaterial({
        uniforms: {
            textureMap: {
                type: 't',
                value: textureMap
            },
            normalMap: {
                type: 't',
                value: normalMap
            },
            lightPosition: {
                type: 'v3',
                value: light.position
            },
            uvScale: {
                type: 'v2',
                value: new THREE.Vector2(1.0, 1.0)
            }
        },

        vertexShader: vertexShader,

        fragmentShader: fragmentShader
    });
    const sphere1 = new THREE.Mesh(moon, shaderMaterial);
    sphere1.geometry.computeTangents();
    sphere1.position.set(0, 0, 0);
    sphere1.rotation.set(0, 180, 0);
    scene.add(sphere1);

    const controls = new OrbitControls(camera, renderer.domElement);
    const clock = new THREE.Clock();
    function animate() {
        // mixer?.update(clock.getDelta());
        light.orbit(sphere1.position, clock.getElapsedTime());
        requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
    }

    useEffect(() => {
        animate();
        subwayRef.current.appendChild(renderer.domElement)
    }, [])

    return <div className="App">
        <div ref={subwayRef}></div>
    </div>
}
export default App;