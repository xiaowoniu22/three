import * as THREE from 'three';
import * as YUKA from 'yuka';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import React, { useRef, useEffect, useState, Suspense } from 'react';
const pointArr = [
    25, 0, -25,
    25, 0, 25,

    25, 0, 25,
    -25, 0, 25,

    -25, 0, 25,
    -25, 0, -25,

    -25, 0, -25,
    25, 0, -25,


    20, 0, -20,
    -20, 0, -20,

    -20, 0, -20,
    -20, 0, 20,

    -20, 0, 20,
    20, 0, 20,

    20, 0, 20,
    20, 0, -20,
];

const App = () => {
    const subwayRef = useRef();

    const renderer = new THREE.WebGLRenderer({ antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);

    const scene = new THREE.Scene();
    renderer.setClearColor(0xFFFFFF);

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

    const dirLight = new THREE.DirectionalLight(0xffffff);
    dirLight.position.set(100, -300, 300);
    dirLight.castShadow = true;
    dirLight.shadow.mapSize.width = 1024;
    dirLight.shadow.mapSize.height = 1024;
    dirLight.shadow.camera.left = -400;
    dirLight.shadow.camera.right = 350;
    dirLight.shadow.camera.top = 400;
    dirLight.shadow.camera.bottom = -300;
    dirLight.shadow.camera.near = 100;
    dirLight.shadow.camera.far = 800;
    scene.add(dirLight);

    const vehicle = new YUKA.Vehicle();

    const sync = (entity, renderComponent) => {
        renderComponent.matrix.copy(entity.worldMatrix);
    }

    const path = new YUKA.Path();

    // path.add(new YUKA.Vector3(-4, 0, 4));
    // path.add(new YUKA.Vector3(-6, 0, 0));
    // path.add(new YUKA.Vector3(-4, 0, -4));
    // path.add(new YUKA.Vector3(0, 0, 0));
    // path.add(new YUKA.Vector3(-4, 0, 4));
    path.add(new YUKA.Vector3(22, 0.1, -22));
    path.add(new YUKA.Vector3(22, 0.1, 22));
    path.add(new YUKA.Vector3(-22, 0.1, 22));
    path.add(new YUKA.Vector3(-22, 0.1, -22));
    // path.add(new YUKA.Vector3(22, -22, 0));
    // path.add(new YUKA.Vector3(-20, -20, 0));
    //  path.add(new YUKA.Vector3(-6, 0, 4));
    // path.add(new YUKA.Vector3(0, 0, 6));

    path.loop = true;

    vehicle.position.copy(path.current());
    vehicle.maxSpeed = 5;

    const followPathBehavior = new YUKA.FollowPathBehavior(path, 3);
    vehicle.steering.add(followPathBehavior);

    const onPathBehavior = new YUKA.OnPathBehavior(path);
    onPathBehavior.radius = 2;
    vehicle.steering.add(onPathBehavior);

    const entityManager = new YUKA.EntityManager();
    entityManager.add(vehicle);

    const loader = new GLTFLoader();
    let model;
    loader.load('/car.glb', function (glb) {
        model = glb.scene;
        scene.add(model);

        model.matrixAutoUpdate = false;
        // vehicle.scale = new YUKA.Vector3(1, 1, 1);
        // vehicle.rotation = new YUKA.Quaternion();
        vehicle.setRenderComponent(model, sync);
    });

    const position = [];
    for (let i = 0; i < path._waypoints.length; i++) {
        const waypoint = path._waypoints[i];
        position.push(waypoint.x, waypoint.y, waypoint.z);
    }
    var shape = new THREE.Shape(position);
    var geometry = new THREE.ShapeGeometry(shape);
    const lineGeometry = new THREE.BufferGeometry();
    lineGeometry.setAttribute('position', new THREE.Float32BufferAttribute(position, 3));

    const lineMaterial = new THREE.LineDashedMaterial({
        color: 0xffffff,//线段的颜色
        dashSize: 1,//短划线的大小
        gapSize: 3,//短划线之间的距离
        linewidth: 3
    });
    const lines = new THREE.LineLoop(lineGeometry, lineMaterial);
    scene.add(lines);
    lines.computeLineDistances();//不可或缺的，若无，则线段不能显示为虚线


    const pointsArr1 = []; // 存放道路外层圈数据
    const pointsArr2 = []; // 存放道路内层圈数据
    for (let i = 0; i < pointArr.length; i += 6) {
        if (i < 24) {
            pointsArr1.push(new THREE.Vector2(pointArr[i], pointArr[i + 2]));
        } else {
            pointsArr2.push(new THREE.Vector2(pointArr[i], pointArr[i + 2]));
        }
    }

    var shape = new THREE.Shape(pointsArr1);
    let holePath = new THREE.Path(pointsArr2);
    // 从外层中掏空内层，就形成马路框框的形状了
    shape.holes.push(holePath);
    var geometry1 = new THREE.ShapeGeometry(shape);
    var material1 = new THREE.MeshPhongMaterial({
        color: new THREE.Color('#546E90'),
        side: THREE.DoubleSide
    });
    var mesh2 = new THREE.Mesh(geometry1, material1);
    mesh2.rotateX(Math.PI / 2);
    scene.add(mesh2);

    const time = new YUKA.Time();

    function animate() {
        const delta = time.update().getDelta();
        entityManager.update(delta);
        controls.update();
        renderer.render(scene, camera);
    }

    renderer.setAnimationLoop(animate);
    const controls = new OrbitControls(camera, renderer.domElement);

    useEffect(() => {

        subwayRef.current.appendChild(renderer.domElement)
    }, [])
    return <div className="App">
        <div ref={subwayRef}></div>
    </div>
}
export default App;