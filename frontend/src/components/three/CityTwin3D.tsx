import { Canvas } from '@react-three/fiber'
import { OrbitControls, Grid, Box, Text } from '@react-three/drei'
import { useMemo } from 'react'
import type { ZoneTraffic } from '../../types/city'

function Building({ position, height, color }: { position: [number, number, number]; height: number; color: string }) {
  return (
    <Box position={position} args={[0.8, height, 0.8]}>
      <meshStandardMaterial color={color} emissive={color} emissiveIntensity={0.3} transparent opacity={0.85} />
    </Box>
  )
}

function CityScene({ zones }: { zones: ZoneTraffic[] }) {
  const buildings = useMemo(() => {
    return zones.map((z, i) => ({
      position: [(i % 3) * 2 - 2, 0, Math.floor(i / 3) * 2 - 2] as [number, number, number],
      height: 0.5 + z.congestion_pct / 40,
      color: z.congestion_pct > 70 ? '#ef4444' : z.congestion_pct > 45 ? '#f59e0b' : '#3b82f6',
      name: z.name.split(' ')[0],
    }))
  }, [zones])

  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[10, 10, 10]} intensity={1} color="#60a5fa" />
      <pointLight position={[-10, 5, -10]} intensity={0.5} color="#22d3ee" />
      <Grid infiniteGrid fadeDistance={30} sectionColor="#1e3a5f" cellColor="#0f172a" />
      {buildings.map((b, i) => (
        <group key={i} position={[b.position[0], b.height / 2, b.position[2]]}>
          <Building position={[0, 0, 0]} height={b.height} color={b.color} />
          <Text position={[0, b.height / 2 + 0.3, 0]} fontSize={0.15} color="#22d3ee" anchorX="center">
            {b.name}
          </Text>
        </group>
      ))}
      <OrbitControls enablePan enableZoom maxPolarAngle={Math.PI / 2.2} />
    </>
  )
}

export default function CityTwin3D({ zones }: { zones: ZoneTraffic[] }) {
  return (
    <div className="glass-panel p-2 h-full min-h-[280px]">
      <h3 className="hud-text text-sm text-nexus-glow mb-2 px-2">3D DIGITAL TWIN ENGINE</h3>
      <Canvas camera={{ position: [6, 6, 6], fov: 50 }} style={{ height: 260, background: 'transparent' }}>
        <CityScene zones={zones} />
      </Canvas>
      <p className="text-[10px] text-slate-500 text-center">Building height ∝ congestion · Live sensor sync</p>
    </div>
  )
}
