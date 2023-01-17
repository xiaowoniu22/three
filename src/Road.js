import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from "d3";
import React, { useRef, useEffect, useState, Suspense } from 'react';

const App = () => {
    const subwayRef = useRef();
    let pointsLine = [];
    const carFrontTexture = new Texture(40, 80, [{ x: 0, y: 10, w: 30, h: 60 }]);
    const carBackTexture = new Texture(40, 80, [{ x: 10, y: 10, w: 30, h: 60 }]);
    const carRightSideTexture = new Texture(110, 40, [{ x: 10, y: 0, w: 50, h: 30 }, { x: 70, y: 0, w: 30, h: 30 }]);
    const carLeftSideTexture = new Texture(110, 40, [{ x: 10, y: 10, w: 50, h: 30 }, { x: 70, y: 10, w: 30, h: 30 }]);
    const vechicleColors = [0xa52523, 0xbdb638, 0x78b14b];
    const zoom = 2;
    let lanes = [];
    let previousTimestamp;


    const positionWidth = 100;
    const columns = 50;
    const boardWidth = positionWidth * columns;

    function Road() {
        const road = new THREE.Group();

        const createSection = color => new THREE.Mesh(
            new THREE.PlaneBufferGeometry(boardWidth * zoom, positionWidth * zoom),
            new THREE.MeshPhongMaterial({ color })
        );

        const middle = createSection(0xcccccc);
        middle.receiveShadow = true;
        road.add(middle);

        const left = createSection(0x393D49);
        left.position.x = - boardWidth * zoom;
        road.add(left);

        const right = createSection(0x393D49);
        right.position.x = boardWidth * zoom;
        road.add(right);

        return road;
    }

    function Grass() {
        const grass = new THREE.Group();

        const createSection = color => new THREE.Mesh(
            new THREE.BoxBufferGeometry(boardWidth * zoom, positionWidth * zoom, 3 * zoom),
            new THREE.MeshPhongMaterial({ color })
        );

        const middle = createSection(0xbaf455);
        middle.receiveShadow = true;
        grass.add(middle);

        const left = createSection(0x99C846);
        left.position.x = - boardWidth * zoom;
        grass.add(left);

        const right = createSection(0x99C846);
        right.position.x = boardWidth * zoom;
        grass.add(right);

        grass.position.z = 1.5 * zoom;
        return grass;
    }

    function Car() {
        const car = new THREE.Group();
        const color = vechicleColors[Math.floor(Math.random() * vechicleColors.length)];

        const main = new THREE.Mesh(
            new THREE.BoxBufferGeometry(60 * zoom, 30 * zoom, 15 * zoom),
            new THREE.MeshPhongMaterial({ color, flatShading: true })
        );
        main.position.z = 12 * zoom;
        main.castShadow = true;
        main.receiveShadow = true;
        car.add(main)

        const cabin = new THREE.Mesh(
            new THREE.BoxBufferGeometry(33 * zoom, 24 * zoom, 12 * zoom),
            [
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carBackTexture }),
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carFrontTexture }),
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carRightSideTexture }),
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true, map: carLeftSideTexture }),
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }), // top
                new THREE.MeshPhongMaterial({ color: 0xcccccc, flatShading: true }) // bottom
            ]
        );
        cabin.position.x = 6 * zoom;
        cabin.position.z = 25.5 * zoom;
        cabin.castShadow = true;
        cabin.receiveShadow = true;
        car.add(cabin);

        const frontWheel = new Wheel();
        frontWheel.position.x = -10 * zoom;
        car.add(frontWheel);

        const backWheel = new Wheel();
        backWheel.position.x = 18 * zoom;
        car.add(backWheel);

        car.castShadow = true;
        car.receiveShadow = false;

        return car;
    }
    function Wheel() {
        const wheel = new THREE.Mesh(
            new THREE.TorusBufferGeometry(10, 3, 16, 100),
            new THREE.MeshLambertMaterial({ color: 0x333333, flatShading: true })
        );
        wheel.position.z = 6 * zoom;
        wheel.position.y = -16 * zoom;
        wheel.rotateX(Math.PI / 2)
        return wheel;
    }

    function Texture(width, height, rects) {
        const canvas = document.createElement("canvas");
        canvas.width = width;
        canvas.height = height;
        const context = canvas.getContext("2d");
        context.fillStyle = "#ffffff";
        context.fillRect(0, 0, width, height);
        context.fillStyle = "rgba(0,0,0,0.6)";
        rects.forEach(rect => {
            context.fillRect(rect.x, rect.y, rect.w, rect.h);
        });
        return new THREE.CanvasTexture(canvas);
    }

    function animate(timestamp) {
        requestAnimationFrame(animate);

        if (!previousTimestamp) previousTimestamp = timestamp;
        const delta = timestamp - previousTimestamp;
        previousTimestamp = timestamp;

        // Animate cars and trucks moving on the lane
        lanes.forEach(lane => {
            // if(lane.type === 'car' || lane.type === 'truck') {
            const aBitBeforeTheBeginingOfLane = -boardWidth * zoom / 2 - positionWidth * 2 * zoom;
            const aBitAfterTheEndOFLane = boardWidth * zoom / 2 + positionWidth * 2 * zoom;
            lane.vechicles.forEach(vechicle => {
                if (lane.direction) {
                    vechicle.position.x = vechicle.position.x < aBitBeforeTheBeginingOfLane ? aBitAfterTheEndOFLane : vechicle.position.x -= 2 / 16 * delta;
                } else {
                    vechicle.position.x = vechicle.position.x > aBitAfterTheEndOFLane ? aBitBeforeTheBeginingOfLane : vechicle.position.x += 2 / 16 * delta;
                }
            });
            // }
        });
    }

    const init = () => {
        // 获取浏览器窗口的宽高，后续会用
        var width = window.innerWidth
        var height = window.innerHeight
        // 创建一个场景
        var scene = new THREE.Scene();
        // 创建一个具有透视效果的摄像机
        var camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 800)
        camera.position.x = 10
        camera.position.y = 10
        camera.position.z = 30
        camera.lookAt(scene.position)

        var renderer = new THREE.WebGLRenderer()
        // 设置渲染器的清除颜色（即背景色）和尺寸。
        // 若想用 body 作为背景，则可以不设置 clearColor，然后在创建渲染器时设置 alpha: true，即 new THREE.WebGLRenderer({ alpha: true })
        renderer.setClearColor(0xffffff)
        renderer.setSize(width, height)
        var box = new THREE.BoxBufferGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        }); //材质对象
        var mesh = new THREE.Mesh(box, material);
        // 设置网格的位置
        mesh.position.set(-10, -50, -50)
        // 将立方体网格加入到场景中
        scene.add(mesh)
        // 通过类CatmullRomCurve3创建一个3D样条曲线
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, -50, -50),
            new THREE.Vector3(10, 0, 0),
            new THREE.Vector3(8, 50, 50),
            new THREE.Vector3(-5, 0, 100)
        ]);
        // 样条曲线均匀分割100分，返回51个顶点坐标
        var points = curve.getPoints(100);

        var pointsCount = 50;
        var pointsCount1 = pointsCount + 1;
        var pts = curve.getPoints(pointsCount);
        var width = 2;
        var widthSteps = 1;
        let pts2 = curve.getPoints(pointsCount);
        pts2.forEach(p => {
            p.z += width;
        });
        pts = pts.concat(pts2);

        var ribbonGeom = new THREE.BufferGeometry().setFromPoints(pts);

        var indices = [];
        for (let iy = 0; iy < widthSteps; iy++) { // the idea taken from PlaneBufferGeometry
            for (let ix = 0; ix < pointsCount; ix++) {
                var a = ix + pointsCount1 * iy;
                var b = ix + pointsCount1 * (iy + 1);
                var c = (ix + 1) + pointsCount1 * (iy + 1);
                var d = (ix + 1) + pointsCount1 * iy;
                // faces
                indices.push(a, b, d);
                indices.push(b, c, d);
            }
        }
        ribbonGeom.setIndex(indices);
        ribbonGeom.computeVertexNormals();

        var ribbon = new THREE.Mesh(ribbonGeom, new THREE.MeshNormalMaterial({
            side: THREE.DoubleSide
        }));
        scene.add(ribbon);


        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({
            color: 0x4488ff
        });
        var line = new THREE.Line(geometry, material);
        let roadLine = new Road();
        let roadLine2 = new Road();
        lanes.push(roadLine);
        lanes.push(roadLine2);
        const vechicle = new Car();
        const vechicle2 = new Car();
        vechicle.position.set(-10, -50, -50)
        const grass = Grass();
        roadLine2.rotateZ(Math.PI / 2)
        grass.position.y = -1 * positionWidth * zoom;
        roadLine.add(vechicle);
        roadLine2.add(vechicle2);
        // scene.add(line)
        // scene.add(roadLine)
        // scene.add(roadLine2)
        scene.add(vechicle)
        scene.scale.set(0.1, 0.1, 0.1)

        let hemiLight = new THREE.HemisphereLight(0xffffff, 0xffffff, 0.6);
        scene.add(hemiLight)

        let dirLight = new THREE.DirectionalLight(0xffffff, 0.6);
        dirLight.position.set(-100, -100, 200);
        dirLight.castShadow = true;
        scene.add(dirLight);

        dirLight.shadow.mapSize.width = 2048;
        dirLight.shadow.mapSize.height = 2048;
        var d = 500;
        dirLight.shadow.camera.left = - d;
        dirLight.shadow.camera.right = d;
        dirLight.shadow.camera.top = d;
        dirLight.shadow.camera.bottom = - d;

        let backLight = new THREE.DirectionalLight(0x000000, .4);
        backLight.position.set(200, 200, 50);
        backLight.castShadow = true;
        scene.add(backLight)
        subwayRef.current.appendChild(renderer.domElement)
        // 渲染，即摄像机拍下此刻的场景
        // renderer.render(scene, camera)

        let arr = []
        for (let i = 0; i < 101; i++) {
            arr.push(i)
        }
        // 生成一个时间序列
        var times = new Float32Array(arr);

        var posArr = []
        points.forEach(elem => {
            posArr.push(elem.x, elem.y, elem.z)
        });
        // 创建一个和时间序列相对应的位置坐标系列
        var values = new Float32Array(posArr);
        // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
        var posTrack = new THREE.KeyframeTrack('.position', times, values);
        let duration = 101;
        let clip = new THREE.AnimationClip("default", duration, [posTrack]);
        var mixer = new THREE.AnimationMixer(vechicle);
        let AnimationAction = mixer.clipAction(clip);
        AnimationAction.timeScale = 20;
        AnimationAction.play();

        var clock = new THREE.Clock();//声明一个时钟对象

        const controls = new OrbitControls(camera, renderer.domElement);

        function render() {
            renderer.render(scene, camera);
            controls.update();
            requestAnimationFrame(render);

            // 更新帧动画的时间
            mixer.update(clock.getDelta());
        }
        // requestAnimationFrame( animate );
        render();
    }
    useEffect(() => {
        init()
    }, [])
    return <div className="App">
        <div ref={subwayRef}></div>
    </div>
}
export default App;