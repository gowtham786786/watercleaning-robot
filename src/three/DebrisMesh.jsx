import React, { useMemo } from 'react'

/**
 * Procedural 3D models for diverse river debris:
 * - 'bottle': Translucent PET beverage bottle with tapered neck & cap
 * - 'can': Metallic soda / aluminum beverage can with rim
 * - 'leaf': Organic river vegetation / aquatic weed foliage
 * - 'bag': Floating wrinkled polythene plastic bag / sheet
 * - 'styrofoam': Matte takeaway foam container / packaging chunk
 * - 'snack_pack': Crinkled metallic foil snack wrapper
 */
export function DebrisMesh({ type = 'bottle', id = 0 }) {
  // Deterministic slight tilt per item id for natural river drift appearance
  const rot = useMemo(() => [
    (id % 4) * 0.08,
    (id % 6) * 0.5,
    (id % 3) * 0.06
  ], [id])

  if (type === 'bottle') {
    return (
      <group rotation={rot}>
        {/* Main Bottle Cylinder */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.045, 0.045, 0.16, 12]} />
          <meshStandardMaterial 
            color="#38BDF8" 
            roughness={0.15} 
            metalness={0.1} 
            transparent 
            opacity={0.82} 
          />
        </mesh>
        {/* Bottle Shoulder Taper */}
        <mesh position={[0, 0.1, 0]} castShadow>
          <coneGeometry args={[0.045, 0.05, 12]} />
          <meshStandardMaterial color="#38BDF8" roughness={0.15} transparent opacity={0.82} />
        </mesh>
        {/* Cap */}
        <mesh position={[0, 0.13, 0]} castShadow>
          <cylinderGeometry args={[0.02, 0.02, 0.025, 8]} />
          <meshStandardMaterial color="#0284C7" roughness={0.4} />
        </mesh>
      </group>
    )
  }

  if (type === 'can') {
    return (
      <group rotation={rot}>
        {/* Soda Can Body */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.042, 0.042, 0.13, 16]} />
          <meshStandardMaterial 
            color="#E11D48" // Beverage can red
            metalness={0.85} 
            roughness={0.3} 
          />
        </mesh>
        {/* Top Rim */}
        <mesh position={[0, 0.066, 0]} castShadow>
          <cylinderGeometry args={[0.041, 0.041, 0.01, 16]} />
          <meshStandardMaterial color="#CBD5E1" metalness={0.9} roughness={0.2} />
        </mesh>
      </group>
    )
  }

  if (type === 'leaf') {
    return (
      <group rotation={rot}>
        {/* Oval Leaf Blade */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <cylinderGeometry args={[0.09, 0.06, 0.012, 8]} />
          <meshStandardMaterial 
            color="#16A34A" // Aquatic plant green
            roughness={0.8} 
            metalness={0.05} 
          />
        </mesh>
        {/* Leaf Stem */}
        <mesh position={[0, 0, 0.08]} rotation={[0.2, 0, 0]} castShadow>
          <cylinderGeometry args={[0.006, 0.004, 0.06, 6]} />
          <meshStandardMaterial color="#14532D" roughness={0.9} />
        </mesh>
      </group>
    )
  }

  if (type === 'bag') {
    return (
      <group rotation={rot}>
        {/* Wrinkled Plastic Bag Base */}
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.16, 0.015, 0.13]} />
          <meshStandardMaterial 
            color="#E2E8F0" 
            roughness={0.5} 
            transparent 
            opacity={0.7} 
          />
        </mesh>
        {/* Folded Layer */}
        <mesh position={[0.03, 0.01, -0.02]} rotation={[0.1, 0.4, -0.1]} castShadow>
          <boxGeometry args={[0.09, 0.015, 0.07]} />
          <meshStandardMaterial color="#E2E8F0" roughness={0.5} transparent opacity={0.65} />
        </mesh>
      </group>
    )
  }

  if (type === 'styrofoam') {
    return (
      <group rotation={rot}>
        <mesh position={[0, 0, 0]} castShadow receiveShadow>
          <boxGeometry args={[0.11, 0.035, 0.09]} />
          <meshStandardMaterial 
            color="#F8FAFC" 
            roughness={0.95} 
            metalness={0.0} 
          />
        </mesh>
      </group>
    )
  }

  // Fallback / snack_pack
  return (
    <group rotation={rot}>
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[0.12, 0.018, 0.14]} />
        <meshStandardMaterial 
          color="#F59E0B" // Metallic snack wrapper foil
          metalness={0.75} 
          roughness={0.25} 
        />
      </mesh>
    </group>
  )
}
