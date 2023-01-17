import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls';
import * as d3 from "d3";
import React, { useRef, useEffect, useState, Suspense } from 'react';

const App = () => {
    const subwayRef = useRef();
    let pointsLine = [];
    const loadJson = (scene) => {
        let loader = new THREE.FileLoader();
        // loader.load('shanghai.json', function (data) {
        //     let jsonData = JSON.parse(data);
        //     initMap(jsonData, scene); // 解析并绘制地图
        // });
        loader.load('subwayLines.json', function (data) {
            let jsonData = JSON.parse(data);
            initLine(jsonData, scene); // 解析并绘制地图
        });
    }
    const createVertexForEachPoint = (object_geometry, values_axis1, values_axis2, values_axis3) => {
        for (var i = 0; i < values_axis1.length; i++) {
            pointsLine.push(new THREE.Vector3(values_axis1[i],
                values_axis2[i], values_axis3[i]));


            // object_geometry.faces.push(new THREE.Face3(0, i + 1, i)); // <- add faces
        }
        object_geometry.setFromPoints(pointsLine);;
    }
    const drawLine = (x_values, y_values, z_values, options) => {
        // container
        var obj = new THREE.Object3D();

        // lines
        var line_geom = new THREE.BufferGeometry();
        createVertexForEachPoint(line_geom, x_values, y_values, z_values);
        var line_material = new THREE.LineBasicMaterial({
            color: 'yellow'
        });

        var line = new THREE.Line(line_geom, line_material);

        obj.add(line);

        // mesh
        var mesh_geom = new THREE.BufferGeometry();
        createVertexForEachPoint(mesh_geom, x_values, y_values, z_values);
        var mesh_material = new THREE.MeshBasicMaterial({
            color: 'blue',
            side: THREE.DoubleSide
        });
        var mesh = new THREE.Mesh(mesh_geom, mesh_material);

        obj.add(mesh);

        // scene.add(obj);

    }
    const initMap = (jsonData, scene) => {
        // 建一个空对象存放对象
        let map = new THREE.Object3D();

        // 墨卡托投影转换
        // const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
        const projection = d3.geoMercator().center([150.5, 31]).scale(100).translate([0, 0]);

        jsonData.features.forEach(elem => {
            // 定一个省份3D对象
            const province = new THREE.Object3D();
            // 每个的 坐标 数组
            const coordinates = elem.geometry.coordinates;
            const points = [];
            // 循环坐标数组
            coordinates.forEach(multiPolygon => {

                multiPolygon.forEach(polygon => {
                    const shape = new THREE.Shape();
                    const lineMaterial = new THREE.LineBasicMaterial({ color: "white" });

                    for (let i = 0; i < polygon.length; i++) {
                        const [x, y] = projection(polygon[i]);
                        // const [x, y] = projection(multiPolygon);
                        if (i === 0) {
                            shape.moveTo(x, -y);
                        }
                        shape.lineTo(x, -y);
                        points.push(new THREE.Vector3(x, -y, 4.01))
                    }
                    console.log(points);
                    const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);;
                    const extrudeSettings = {
                        depth: 4,
                        bevelEnabled: false
                    };


                    const geometry = new THREE.ExtrudeGeometry(shape, extrudeSettings)
                    const material = new THREE.MeshBasicMaterial({ color: '#02A1E2', transparent: true, opacity: 0.6 })
                    const material1 = new THREE.MeshBasicMaterial({ color: '#3480C4', transparent: true, opacity: 0.5 })
                    const mesh = new THREE.Mesh(geometry, [material, material1])
                    const line = new THREE.Line(lineGeometry, lineMaterial)
                    province.add(mesh)
                    province.add(line)
                })

            })
            // 将geo的属性放到省份模型中
            province.properties = elem.properties;
            if (elem.properties.contorid) {
                const [x, y] = projection(elem.properties.contorid);
                province.properties._centroid = [x, y];
            }

            map.add(province);

        })
        scene.add(map)

    }
    const initLine = (jsonData, scene) => {
        // 建一个空对象存放对象
        let map = new THREE.Object3D();

        // 墨卡托投影转换
        // const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
        const projection = d3.geoMercator().center([-74, 40.7]).scale(2000).translate([0, 0]);

        jsonData.features.forEach(elem => {
            // 定一个省份3D对象
            const province = new THREE.Object3D();
            // 每个的 坐标 数组
            const coordinates = elem.geometry.coordinates;
            const points = [];
            // points.push(new THREE.Vector3( 1000, 0, 4.01))
            // 循环坐标数组
            coordinates.forEach(multiPolygon => {

                const lineMaterial = new THREE.LineBasicMaterial({ color: "red" });

                // for (let i = 0; i < multiPolygon.length; i++) {
                const [x, y] = projection(multiPolygon);
                points.push(new THREE.Vector3(x, -y, 4.01))
                // }
                const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);;
                const line = new THREE.Line(lineGeometry, lineMaterial)
                province.add(line)



                // let arr = []
                // for (let i = 0; i < 101; i++) {
                //     arr.push(i)
                // }
                // // 生成一个时间序列
                // var times = new Float32Array(arr);

                // var posArr = []
                // points.forEach(elem => {
                //     posArr.push(elem.x, elem.y, elem.z)
                // });
                // // 创建一个和时间序列相对应的位置坐标系列
                // var values = new Float32Array(posArr);
                // // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
                // var posTrack = new THREE.KeyframeTrack('.position', times, values);
                // let duration = 101;
                // let clip = new THREE.AnimationClip("default", duration, [posTrack]);
                // var mixer = new THREE.AnimationMixer(mesh);
                // let AnimationAction = mixer.clipAction(clip);
                // AnimationAction.timeScale = 20;
                // AnimationAction.play();
            })
            var box = new THREE.SphereGeometry(0.05, 32, 16);
            var material = new THREE.MeshLambertMaterial({
                color: 0x0000ff
            }); //材质对象
            var mesh = new THREE.Mesh(box, material);
            // 设置网格的位置
            const [x, y] = projection(coordinates[0]);
            mesh.position.set(x, -y, 4.01)
            province.add(mesh)

            // let arr = []
            // for (let i = 0; i < 101; i++) {
            //     arr.push(i)
            // }
            // // 生成一个时间序列
            // var times = new Float32Array(arr);

            // var posArr = []
            // points.forEach(elem => {
            //     posArr.push(elem.x, elem.y, elem.z)
            // });
            // // 创建一个和时间序列相对应的位置坐标系列
            // var values = new Float32Array(posArr);
            // // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
            // var posTrack = new THREE.KeyframeTrack('.position', times, values);
            // let duration = 101;
            // let clip = new THREE.AnimationClip("default", duration, [posTrack]);
            // var mixer = new THREE.AnimationMixer(mesh);
            // let AnimationAction = mixer.clipAction(clip);
            // AnimationAction.timeScale = 20;
            // AnimationAction.play();


            map.add(province);

        })
        scene.add(map)
    }
    const initNYCLine = (jsonData, scene) => {
        // 建一个空对象存放对象
        let map = new THREE.Object3D();

        // 墨卡托投影转换
        // const projection = d3.geoMercator().center([104.0, 37.5]).scale(80).translate([0, 0]);
        const projection = d3.geoMercator().center([-74, 40]).scale(1000).translate([0, 0]);
        const points = [];
        const province = new THREE.Object3D();
        jsonData.features.forEach(elem => {
            // 每个的 坐标 数组
            const coordinates = elem.geometry.coordinates;
            const [x, y] = projection(coordinates);
            points.push(new THREE.Vector3(x, -y, 4.01))
            // }


        })
        const lineMaterial = new THREE.LineBasicMaterial({ color: "red" });
        const lineGeometry = new THREE.BufferGeometry().setFromPoints(points);;
        const line = new THREE.Line(lineGeometry, lineMaterial)
        console.log(22222, points);
        province.add(line)

        map.add(province);
        scene.add(map)
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
        var box = new THREE.BoxGeometry(1, 1, 1);
        var material = new THREE.MeshLambertMaterial({
            color: 0x0000ff
        }); //材质对象
        var mesh = new THREE.Mesh(box, material);
        // 设置网格的位置
        mesh.position.set(-10, -50, -50)
        // 将立方体网格加入到场景中
        // scene.add(mesh)
        // 通过类CatmullRomCurve3创建一个3D样条曲线
        var curve = new THREE.CatmullRomCurve3([
            new THREE.Vector3(-10, -50, -50),
            new THREE.Vector3(10, 0, 0),
            new THREE.Vector3(8, 50, 50),
            new THREE.Vector3(-5, 0, 100)
        ]);
        // 样条曲线均匀分割100分，返回51个顶点坐标
        var points = curve.getPoints(100);
        const geometry = new THREE.BufferGeometry().setFromPoints(points);
        var material = new THREE.LineBasicMaterial({
            color: 0x4488ff
        });
        var line = new THREE.Line(geometry, material);
        // scene.add(line)
        subwayRef.current.appendChild(renderer.domElement)
        // 渲染，即摄像机拍下此刻的场景
        // renderer.render(scene, camera)
        loadJson(scene)

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
        // 创建一个和时间序列相对应的位置坐标
        var values = new Float32Array(posArr);
        // 创建一个帧动画的关键帧数据，曲线上的位置序列对应一个时间序列
        var posTrack = new THREE.KeyframeTrack('.position', times, values);
        let duration = 101;
        let clip = new THREE.AnimationClip("default", duration, [posTrack]);
        var mixer = new THREE.AnimationMixer(mesh);
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
            // mixer.update(clock.getDelta());
        }

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