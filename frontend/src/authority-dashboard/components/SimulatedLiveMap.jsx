import React, { useRef, useState, useMemo } from 'react';
import { Canvas, useFrame, useThree } from '@react-three/fiber';
import { OrbitControls, Sphere, Html, Line } from '@react-three/drei';
import * as THREE from 'three';
import '../Theme.css';

// D.Y. Patil Architectural Wireframe
const StadiumModel = () => {
    return (
        <group>
            {/* Outer Oval Structure */}
            <mesh rotation={[Math.PI / 2, 0, 0]}>
                <torusGeometry args={[14, 1.5, 16, 64]} />
                <meshBasicMaterial color="#00AEEF" wireframe={true} transparent opacity={0.15} />
            </mesh>

            {/* Inner Pitch */}
            <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1, 0]}>
                <planeGeometry args={[12, 20]} />
                <meshBasicMaterial color="#10B981" wireframe={true} transparent opacity={0.1} />
            </mesh>

            {/* Spectator Stands (Tiers) */}
            <mesh position={[0, 2, 0]}>
                <cylinderGeometry args={[16, 12, 6, 32, 3, true]} />
                <meshBasicMaterial color="#60A5FA" wireframe={true} transparent opacity={0.2} />
            </mesh>
            <mesh position={[0, 4, 0]}>
                <cylinderGeometry args={[18, 16, 4, 32, 2, true]} />
                <meshBasicMaterial color="#3B82F6" wireframe={true} transparent opacity={0.15} />
            </mesh>
        </group>
    );
};

// Spatial Coordinates for the 3D map (X, Y, Z)
const STADIUM_ZONES = {
    "North Wing": [0, 4, -14],
    "South East Wing": [10, 4, 10],
    "Media & TV": [-14, 6, 0],
    "Gate 1": [-6, 0, -14],
    "Gate 2": [0, 0, -16],
    "Gate 3": [6, 0, -14],
    "Gate 4": [12, 0, -8],
    "Gate 5": [14, 0, 0],
    "Gate 6": [12, 0, 8],
    "Gate 7": [6, 0, 14],
    "Gate 8": [0, 0, 16],
    "Gate 9": [-6, 0, 14],
    // Fallbacks for existing DB records before re-seeding
    "Gate A Entrance": [-8, 0, 8],
    "Main Concourse": [0, 0, 10],
    "East Exit Plaza": [10, 0, 0]
};

// Procedural Crowd Particle System
const ParticleSystem = ({ density, color, activeAlert, pos }) => {
    const meshRef = useRef();
    const count = Math.max(10, Math.floor(density * 400)); // Up to 400 particles per zone
    const dummy = useMemo(() => new THREE.Object3D(), []);

    const particles = useMemo(() => {
        const temp = [];
        for (let i = 0; i < 400; i++) {
            temp.push({
                offset: new THREE.Vector3((Math.random() - 0.5) * 4, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 4),
                velocity: new THREE.Vector3((Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04, (Math.random() - 0.5) * 0.04),
                speed: 0.2 + Math.random() * 0.8
            });
        }
        return temp;
    }, []);

    useFrame(() => {
        if (!meshRef.current) return;

        const isResolved = activeAlert && activeAlert.status === 'RESOLVED';
        const isSurge = activeAlert && activeAlert.alertType === 'SURGE';

        particles.forEach((particle, i) => {
            if (i >= count) return;

            if (isResolved) {
                // Vector flow animation toward exit direction
                particle.offset.x += 0.04 * particle.speed;
                particle.offset.z += 0.04 * particle.speed;
                if (particle.offset.length() > 6) {
                    particle.offset.set((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
                }
            } else {
                // Tightly packed for high density, faster movement for surge
                const spreadMultiplier = density > 0.75 ? 1.2 : 2.5;
                const speedK = isSurge ? 3 : 1;

                particle.offset.add(particle.velocity.clone().multiplyScalar(speedK));

                if (particle.offset.length() > spreadMultiplier) {
                    particle.offset.setLength(spreadMultiplier);
                    particle.velocity.negate();
                }
            }

            dummy.position.copy(particle.offset);
            dummy.scale.setScalar(0.12);
            dummy.updateMatrix();
            meshRef.current.setMatrixAt(i, dummy.matrix);
        });
        meshRef.current.instanceMatrix.needsUpdate = true;
    });

    return (
        <instancedMesh ref={meshRef} args={[null, null, count]} position={pos}>
            <sphereGeometry args={[0.2, 8, 8]} />
            <meshBasicMaterial color={color} transparent opacity={0.6} depthWrite={false} blending={THREE.AdditiveBlending} />
        </instancedMesh>
    );
};

// Dynamic Volumetric Heat Nodes
const HeatNode = ({ zone, activeAlert }) => {
    const density = zone.capacity > 0 ? (zone.currentOccupancy / zone.capacity) : 0;
    const pos = STADIUM_ZONES[zone.zoneName] || [0, 0, 0];
    const [hovered, setHovered] = useState(false);

    // Conditional Shader Logic matches requested hex exactness
    let color = '#00FF00'; // Nominal (<50%) Green
    let scale = 1;

    if (density >= 0.9) {
        color = '#FF0000'; // Critical (>90%) Red
        scale = 3.5;
    } else if (density >= 0.75) {
        color = '#FFA500'; // High (>75%) Orange
        scale = 2.2;
    } else if (density >= 0.5) {
        color = '#FFFF00'; // Elevated (>50%) Yellow
        scale = 1.5;
    }

    const ref = useRef();

    useFrame((state) => {
        if (!ref.current) return;
        if (density >= 0.9) {
            ref.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 8) * 0.3);
        } else if (density >= 0.75) {
            ref.current.scale.setScalar(scale + Math.sin(state.clock.elapsedTime * 3) * 0.15);
        } else {
            ref.current.scale.setScalar(scale);
        }
    });

    return (
        <group position={pos}>
            <ParticleSystem density={density} color={color} activeAlert={activeAlert} pos={[0, 0, 0]} />

            <Sphere
                ref={ref}
                args={[1, 16, 16]}
                onPointerOver={() => setHovered(true)}
                onPointerOut={() => setHovered(false)}
            >
                <meshBasicMaterial color={color} transparent opacity={0.15} depthWrite={false} blending={THREE.AdditiveBlending} />
            </Sphere>

            {hovered && (
                <Html center position={[0, scale + 2, 0]} zIndexRange={[100, 0]} className="pointer-events-none transition-all duration-300">
                    <div className="bg-white/10 backdrop-blur-md px-4 py-3 rounded-xl shadow-[0_8px_32px_0_rgba(0,0,0,0.37)] border border-white/20 text-center min-w-[140px]">
                        <p className="text-[10px] font-bold text-gray-200 uppercase tracking-widest pb-1 border-b border-white/20 mb-2">ZONE: {zone.zoneName}</p>
                        <p className="text-[10px] font-semibold text-gray-300 uppercase tracking-wider mb-1">
                            {activeAlert ? `🚨 ${activeAlert.alertType}` : 'STATUS: NORMAL'}
                        </p>
                        <p className="text-xl font-black drop-shadow-md" style={{ color }}>DENSITY: {Math.round(density * 100)}%</p>
                    </div>
                </Html>
            )}
        </group>
    );
};

// 3D Escape Route Pathing
const EscapeRoute = ({ startZoneName }) => {
    // Generate a simple path out of the stadium from the incident
    const startPos = STADIUM_ZONES[startZoneName];
    if (!startPos) return null;

    // Hardcode some nodes for a stylistic escape path toward (0,0,25) which is "outside"
    const points = [
        new THREE.Vector3(...startPos),
        new THREE.Vector3(startPos[0] * 0.5, 0, startPos[2] * 0.5),
        new THREE.Vector3(0, 0, startPos[2] > 0 ? 25 : -25)
    ];

    return (
        <group>
            <Line
                points={points}
                color="#00AEEF"
                lineWidth={4}
                dashed={false}
            />
            {/* Pulsing indicator at the exit */}
            <Html position={[0, 1, startPos[2] > 0 ? 25 : -25]} center className="pointer-events-none">
                <span className="bg-[#00AEEF] text-white text-[8px] font-bold px-1.5 py-0.5 rounded shadow-lg animate-pulse">SAFE EXIT</span>
            </Html>
        </group>
    );
};

// Intelligent Camera Controller
const CameraRig = ({ activeAlert, vrMode }) => {
    const { camera, controls } = useThree();

    useFrame((state, delta) => {
        if (!controls) return;

        let targetPosition = new THREE.Vector3(0, 25, 30); // Default Top-Down
        let lookAtTarget = new THREE.Vector3(0, 0, 0);

        if (vrMode && activeAlert && STADIUM_ZONES[activeAlert.zoneName]) {
            // "Tactical View": Fly into the specific gate
            const sz = STADIUM_ZONES[activeAlert.zoneName];
            targetPosition.set(sz[0] * 1.5, sz[1] + 2, sz[2] * 1.5);
            lookAtTarget.set(sz[0], sz[1], sz[2]);
        } else if (vrMode) {
            // General low angle
            targetPosition.set(0, 5, 20);
        } else if (activeAlert && STADIUM_ZONES[activeAlert.zoneName]) {
            // Zoom in slightly from top down on the alert
            const sz = STADIUM_ZONES[activeAlert.zoneName];
            targetPosition.set(sz[0], 15, sz[2] + 15);
            lookAtTarget.set(sz[0], 0, sz[2]);
        }

        camera.position.lerp(targetPosition, delta * 3);
        controls.target.lerp(lookAtTarget, delta * 3);
        controls.update();
    });

    return null;
};

const SimulatedLiveMap = ({ zones, alerts }) => {
    const [vrMode, setVrMode] = useState(false);

    // Determine the most critical active alert for camera focus
    const activeAlert = alerts && alerts.find(a => a.status === 'OPEN' && a.severity === 'CRITICAL');

    return (
        <div className="glass-card flex flex-col h-full min-h-[500px] relative overflow-hidden border-opacity-40">

            {/* Header / UI Overlay */}
            <div className="flex justify-between items-center mb-4 z-10 relative">
                <div className="flex items-center space-x-2">
                    <svg className="w-5 h-5 text-[var(--color-secondary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9m-9 9a9 9 0 019-9"></path></svg>
                    <h2 className="text-lg font-black text-[var(--color-primary)] uppercase tracking-wide">3D Digital Twin</h2>
                </div>

                <div className="flex space-x-3">
                    <button
                        onClick={() => setVrMode(!vrMode)}
                        className={`text-[10px] font-bold px-3 py-1.5 rounded uppercase tracking-widest transition-colors border ${vrMode ? 'bg-[var(--color-secondary)] text-white border-transparent shadow-lg' : 'bg-white text-[var(--color-primary)] border-gray-300 hover:bg-gray-50'}`}
                    >
                        {vrMode ? 'Exit Tactical (VR)' : 'Enter Tactical (VR)'}
                    </button>

                    <div className="flex items-center space-x-2 text-xs font-mono text-gray-400 bg-gray-50 px-2 py-1 rounded border border-gray-200">
                        <span className="animate-pulse w-2 h-2 bg-emerald-500 rounded-full"></span>
                        <span className="text-[10px]">SYNCED</span>
                    </div>
                </div>
            </div>

            {/* 3D Canvas Rendering Area */}
            <div className="flex-1 relative rounded-xl border border-gray-800 shadow-inner overflow-hidden cursor-move" style={{ backgroundImage: 'radial-gradient(circle at center, #0f172a 0%, #020617 100%)' }}>

                <Canvas camera={{ position: vrMode ? [0, 5, 20] : [0, 25, 30], fov: 45 }}>
                    <ambientLight intensity={0.5} />
                    <pointLight position={[10, 20, 10]} intensity={1.5} color="#00AEEF" />
                    <pointLight position={[-10, 10, -10]} intensity={0.8} color="#10B981" />

                    {/* Render the structural wireframe */}
                    <StadiumModel />

                    {/* Render the dynamic user tracking volumes and particle swarms */}
                    {zones && zones.map((zone) => {
                        const zoneAlert = alerts?.find(a => a.zoneId === zone._id && a.status !== 'RESOLVED');
                        return <HeatNode key={zone._id} zone={zone} activeAlert={zoneAlert} />;
                    })}

                    {/* Intelligent Camera Movement */}
                    <CameraRig activeAlert={activeAlert} vrMode={vrMode} />

                    {/* AI Suggested Escape Route on Critical Error */}
                    {activeAlert && <EscapeRoute startZoneName={activeAlert.zoneName} />}

                    <OrbitControls
                        makeDefault
                        enableDamping
                        dampingFactor={0.05}
                        maxPolarAngle={Math.PI / 2 - 0.05} // Prevent camera from going under ground
                        minDistance={5}
                        maxDistance={60}
                    />
                </Canvas>

                {/* Status Overlay Legend */}
                <div className="absolute bottom-4 left-4 bg-[#0B1120] bg-opacity-80 p-3 rounded border border-gray-700 backdrop-blur-md shadow-[0_0_20px_rgba(0,0,0,0.5)] pointer-events-none">
                    <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-2 border-b border-gray-700 pb-1">Telemetry HUD Density</h4>
                    <div className="space-y-1.5">
                        <div className="flex items-center space-x-2 text-xs text-gray-300"><span className="w-3 h-3 rounded bg-[#00FF00] shadow-[0_0_8px_#00FF00]"></span><span>Nominal (&lt;50%)</span></div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300"><span className="w-3 h-3 rounded bg-[#FFFF00] shadow-[0_0_8px_#FFFF00]"></span><span>Elevated (&lt;75%)</span></div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300"><span className="w-3 h-3 rounded bg-[#FFA500] shadow-[0_0_8px_#FFA500]"></span><span>High (&lt;90%)</span></div>
                        <div className="flex items-center space-x-2 text-xs text-gray-300"><span className="w-3 h-3 rounded bg-[#FF0000] shadow-[0_0_8px_#FF0000]"></span><span className="text-red-400 font-bold drop-shadow-[0_0_5px_rgba(239,68,68,0.8)]">Critical Bottleneck</span></div>
                    </div>
                </div>

                <div className="absolute top-4 left-4 pointer-events-none">
                    <p className="text-[10px] font-mono text-[#00AEEF] font-bold tracking-widest uppercase mb-1 drop-shadow-[0_0_5px_rgba(0,174,239,0.5)]">D.Y. Patil Stadium (Nerul)</p>
                    <p className="text-[9px] text-gray-400">Drag to Pan | Scroll to Zoom</p>
                </div>
            </div>
        </div>
    );
};

export default SimulatedLiveMap;
