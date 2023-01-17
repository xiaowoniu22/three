import React, { useEffect, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, ContactShadows, PresentationControls, PerspectiveCamera } from '@react-three/drei'
import noise from "three";


// Color hex codes
const colors = {
    WHITE: 0xffffff,
    BLACK: 0x000000,
    DARK_BROWN: 0x736b5c,
    STREET: 0x999999,
    BUILDING: 0xe8e8e8,
    GREEN: 0x81a377,
    TREE: 0x216e41,
    DARK_GREY: 0x888888,
    WATER: 0x4b95de
};
// These are our city base heights
const groundHeight = 30;
const curbHeight = 1;
let blockSize = 150;
let gridSize = 15;
const groundThreshold = 0.85;
// Helper functions used to get our total city size
function getCityWidth() {
    return blockSize * gridSize;
}
 
 function getCityLength() {
	return blockSize * gridSize;
 }
 // Split a 1-D array into a 2-D array containing the specified number of columns in each sub-array.
 function generate2DArray(array, numberOfColumns) {
   
	var temp = array.slice(0);
	var results = [];
 
	while (temp.length) {
	   results.push(temp.splice(0, numberOfColumns));
	}
 
	return results;
   
 }
 function generatePreceduralMaps() {
   
	noise.seed(Math.random());
 
	// Noise frequency values we're using to generate our block distribution. The higher the value, the smoother the
	// distribution:
 
	// This is the general noise distribution used for the ground / water block assignments
	var generalNoiseFrequency = 15;
 
	// This is the ground noise distribution used for the building / park / parking block assignments
	var groundNoiseFrequency = 8;
 
	// Arrays to use in order to hold our generated noise values
	var generalNoiseDistribution = [];
	var groundNoiseDistribution = [];
 
	// Generate the ground / general noise arrays holding the perlin noise distribution
	for (i = 0; i < gridSize; i++) {
	   for (j = 0; j < gridSize; j++) {
		  generalNoiseDistribution.push(getNoiseValue(i, j, generalNoiseFrequency));
		  groundNoiseDistribution.push(getNoiseValue(i, j, groundNoiseFrequency));
	   }
	}
 
	// Generate a normalized noise array which holds a range of values between [0, 1]
	var normalizedDistribution = normalizeArray(generalNoiseDistribution);
 
	// Map our noises to an binary array which serves as an indicator showing whether the array element is a
	// ground block or a water block
	var groundDistributionMap = normalizedDistribution.map(function (arrayValue) {
	   return arrayValue <= groundThreshold ? true : false;
	});
 
	// Transform the 1-D ground mapping into a 2-D array with (x, z) coordinates
	groundMap = generate2DArray(groundDistributionMap, gridSize);
 
	// Generate a normalized array for our ground distribution
	var normalizedGroundDistribution = normalizeArray(groundNoiseDistribution);
 
	// Map our noises to an array holding binary values which indicate whether it's a building or a park block
	var buildingDistributionMap = normalizedGroundDistribution.map(function (
	   arrayValue,
	   index
	) {
	   return groundDistributionMap[index] && arrayValue > parkThreshold ?
		  true :
		  false;
	});
 
	// Transform the 1-D building mapping into a 2-D array with (x, z) coordinates
	buildingMap = generate2DArray(buildingDistributionMap, gridSize);
 }
function getBoxMesh(boxGeometryParameters, position, color, castShadow) {
    const { width, height, depth } = boxGeometryParameters;
    const { x, y, z } = position;
    return <mesh>
        <boxGeometry attach="geometry" args={[width, height, depth]} position={[x, y, z]} />
        <meshLambertMaterial color={color} />
    </mesh>;

}
// Translate the grid x coordinate into a THREE.js scene x coordinate and return it
function getSceneXCoordinate(x) {
    return x * blockSize + blockSize / 2 - getCityWidth() / 2;

}
 
 // Translate the grid z coordinate into a THREE.js scene z coordinate and return it
 function getSceneZCoordinate(z) { 
	return z * blockSize + blockSize / 2 - getCityLength() / 2;
 }
let groundMap = [-3, 3]
var streetHeight = 2 * curbHeight;
groundMap = generate2DArray(groundDistributionMap, gridSize);
const City = () => {
    const myref = useRef();

    //    useFrame(() => (myref.current.rotation.x = myref.current.rotation.y += 0.01));
    return (
        <div className="App">
            <Canvas>
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
                    <group scale={1}>
                        {groundMap.map((ground, i) => {
                            ground.map((item, j) => {
                                var x = getSceneXCoordinate(i);
                                var z = getSceneZCoordinate(j);
                                console.log('------', ground)
                                return <getBoxMesh
                                    boxGeometryParameters={{
                                        width: blockSize,
                                        height: 0,
                                        depth: blockSize
                                    }}
                                    position={{
                                        x: x,
                                        y: -streetHeight,
                                        z: z
                                    }}
                                    colors={colors.DARK_BROWN}
                                />
                            })

                        })}

                    </group>
                </PresentationControls>
            </Canvas>
        </div>

    )
}

export default City;