import * as THREE from 'three';
import { Suspense, useRef, useState } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { useGLTF, Environment, Text } from '@react-three/drei';
import { EffectComposer, DepthOfField } from '@react-three/postprocessing'

function Banana({ z }) {
  const ref = useRef();
  const { nodes, materials } = useGLTF('/banana-v1-transformed.glb')

  // const [clicked, setClicked] = useState(false);
  const { viewport, camera } = useThree()
  const { width, height } = viewport.getCurrentViewport(camera, [0, 0, z]);

  const [data] = useState({
    x: THREE.MathUtils.randFloatSpread(2),
    y: THREE.MathUtils.randFloatSpread(height),
    rX: Math.random() * Math.PI,
    rY: Math.random() * Math.PI,
    rZ: Math.random() * Math.PI,
  })

  useFrame((state) => {
    ref.current.rotation.set(data.rX += 0.001, data.rY += 0.002, data.rZ += 0.003);
    
    // ref.current.position.z = THREE.MathUtils.lerp(ref.current.position.z, clicked ? 1 : 0, 0.1);

    ref.current.position.set(data.x * (width/2), data.y += 0.015, z);
    // ref.current.position.set(width/2, data.y += 0.05, 0);
    if (data.y > height/1.2) {
      data.y = -height/1.4;
    }
  });

  return (
    // <mesh ref={ref} rotation={[0.4,0.5,0.4]} onClick={() => setClicked(!clicked)}>
    <mesh ref={ref} geometry={nodes.banana.geometry} material={materials.Banana_High} material-emissive="orange"/>
  )
}

export default function App({ count = 100, depth = 80 }) {
  const _count = window.innerWidth < 500 ? count / 3 : count;
  const _fontsize = window.innerWidth < 500 ? 1.7 : 2;

  return <Canvas shadows gl={{ alpha: false }} camera={{near: 0.01, far: 110, fov: 30}}>
    <color attach="background" args={['#ffdc96']} />
    {/* <ambientLight intensity={0.5} />
    <spotLight position={[10, 10, 10]} intensity={2} />
  */}
    {/* <ambientLight intensity={0.2} /> */}
    <spotLight position={[10, 20, 10]} intensity={1} />
    <Suspense fallback={null}>
      <Text fontSize={_fontsize} color="#000" position={[0, 3, -60]} >
      THIS
      </Text>
      <Text fontSize={_fontsize} color="#000" position={[0, 0, -45]} >
      IS
      </Text>
      <Text fontSize={_fontsize} color="#000" position={[0, -2, -30]} >
      BANANAS
    </Text>
  {Array.from({ length: _count }, (_, i) => (
    <Banana key={i} z={-(i / _count) * depth-30} />
  ))}
      {/* <Banana scale={0.5} />
      <Banana scale={0.5} position={[2,2,-1]}/> */}
      <Environment preset="city" />
      
      <EffectComposer>
        <DepthOfField target={[0,0, depth/2]} focalLength={0.7} bokehScale={8} height={700} />
      </EffectComposer>
    </Suspense>
    
  </Canvas>;
}
