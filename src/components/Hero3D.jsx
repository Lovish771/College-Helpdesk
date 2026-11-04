import { Canvas } from '@react-three/fiber';
import { Float, Sphere, Box } from '@react-three/drei';
import { useRef } from 'react';

function FloatingObjects() {
  return (
    <group>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <Sphere args={[0.8, 32, 32]} position={[-2, 1, 0]}>
          <meshStandardMaterial color="#12305a" metalness={0.3} roughness={0.4} />
        </Sphere>
      </Float>
      <Float speed={1.5} rotationIntensity={0.3} floatIntensity={0.4} delay={0.5}>
        <Box args={[0.6, 0.8, 0.1]} position={[1.5, -0.5, 0]} rotation={[0.2, 0.3, 0]}>
          <meshStandardMaterial color="#b45309" metalness={0.2} roughness={0.5} />
        </Box>
      </Float>
      <Float speed={2.5} rotationIntensity={0.4} floatIntensity={0.3} delay={1}>
        <Sphere args={[0.5, 32, 32]} position={[2, 1.5, -1]}>
          <meshStandardMaterial color="#4a90a4" metalness={0.3} roughness={0.4} />
        </Sphere>
      </Float>
      <Float speed={1.8} rotationIntensity={0.2} floatIntensity={0.5} delay={1.5}>
        <Box args={[0.4, 0.4, 0.1]} position={[-1.5, -1, 0.5]} rotation={[0, 0.5, 0.2]}>
          <meshStandardMaterial color="#eab308" metalness={0.2} roughness={0.5} />
        </Box>
      </Float>
    </group>
  );
}

export default function Hero3D() {
  return (
    <div className="h-full w-full">
      <Canvas
        camera={{ position: [0, 0, 5], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        dpr={[1, 2]}
      >
        <ambientLight intensity={0.5} />
        <directionalLight position={[5, 5, 5]} intensity={0.8} />
        <pointLight position={[-5, -5, -5]} intensity={0.3} />
        <FloatingObjects />
      </Canvas>
    </div>
  );
}
