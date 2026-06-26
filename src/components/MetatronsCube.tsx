import React, { useMemo } from 'react';
import { motion } from 'framer-motion';

interface MetatronsCubeProps {
  isMirroring?: boolean;
  intensity?: 'neutral' | 'high-resistance' | 'reflective' | 'low-intensity';
}

const MetatronsCube: React.FC<MetatronsCubeProps> = ({ isMirroring = false, intensity = 'neutral' }) => {
  // Brand color mapping based on design specifications
  // Cyan (#00E5FF) to Hot Pink (#FF4081)
  const glowColor = useMemo(() => {
    switch (intensity) {
      case 'high-resistance':
        return '#FF4081'; // Hot Pink / Terminal
      case 'reflective':
        return '#AA00FF'; // Violet / Reflective
      case 'low-intensity':
        return '#2962FF'; // Cobalt / Low Intensity
      default:
        return '#00E5FF'; // Cyan / Start/Input
    }
  }, [intensity]);

  const secondaryColor = '#D500F9'; // Magenta accent

  // Mathematically calculate the 13 nodes of Metatron's Cube
  // 1 Center Node + 6 Inner Hexagon Nodes + 6 Outer Hexagon Nodes
  const { nodes, connections } = useMemo(() => {
    const calculatedNodes = [{ x: 50, y: 50 }]; // Center (Index 0)
    const angles = [0, 60, 120, 180, 240, 300];

    // 6 Inner ring nodes (Radius = 22)
    angles.forEach(angle => {
      const rad = (angle * Math.PI) / 180;
      calculatedNodes.push({
        x: 50 + 22 * Math.cos(rad),
        y: 50 + 22 * Math.sin(rad)
      });
    });

    // 6 Outer ring nodes (Radius = 44)
    angles.forEach(angle => {
      const rad = (angle * Math.PI) / 180;
      calculatedNodes.push({
        x: 50 + 44 * Math.cos(rad),
        y: 50 + 44 * Math.sin(rad)
      });
    });

    // Generate connections between all 13 nodes (78 lines total)
    const calculatedConnections: Array<{ x1: number; y1: number; x2: number; y2: number; key: string; delay: number }> = [];
    for (let i = 0; i < calculatedNodes.length; i++) {
      for (let j = i + 1; j < calculatedNodes.length; j++) {
        // Calculate distance to add slight organic staggered delay based on geometry
        const dist = Math.hypot(calculatedNodes[i].x - calculatedNodes[j].x, calculatedNodes[i].y - calculatedNodes[j].y);
        calculatedConnections.push({
          x1: calculatedNodes[i].x,
          y1: calculatedNodes[i].y,
          x2: calculatedNodes[j].x,
          y2: calculatedNodes[j].y,
          key: `${i}-${j}`,
          delay: (dist / 100) * 0.4 // closer lines animate slightly faster
        });
      }
    }

    return { nodes: calculatedNodes, connections: calculatedConnections };
  }, []);

  return (
    <div className="absolute inset-0 flex items-center justify-center pointer-events-none z-0 overflow-hidden">
      {/* Viewport Edge Glow Effects */}
      <div 
        className="absolute w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${glowColor} 0%, transparent 70%)`,
          left: '10%',
          top: '20%'
        }}
      />
      <div 
        className="absolute w-[600px] h-[600px] rounded-full filter blur-[120px] opacity-10 transition-colors duration-1000"
        style={{
          background: `radial-gradient(circle, ${secondaryColor} 0%, transparent 70%)`,
          right: '10%',
          bottom: '20%'
        }}
      />

      <motion.svg
        viewBox="0 0 100 100"
        className="w-full h-full max-w-[min(85vw,85vh)] aspect-square opacity-30 sm:opacity-40"
        initial={{ rotate: 0 }}
        animate={{ 
          rotate: 360,
          scale: isMirroring ? 1.05 : 1
        }}
        transition={{ 
          rotate: { duration: 80, repeat: Infinity, ease: "linear" },
          scale: { duration: 3, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" }
        }}
      >
        <defs>
          <radialGradient id="cubeGlow">
            <stop offset="0%" stopColor={glowColor} stopOpacity="0.4" />
            <stop offset="50%" stopColor={secondaryColor} stopOpacity="0.1" />
            <stop offset="100%" stopColor="#05050a" stopOpacity="0" />
          </radialGradient>
          
          {/* Volumetric glow filter */}
          <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="0.6" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Breathing Pulse Core Overlay */}
        <motion.circle
          cx="50"
          cy="50"
          r="46"
          fill="url(#cubeGlow)"
          animate={{ 
            opacity: isMirroring ? [0.2, 0.5, 0.2] : [0.15, 0.3, 0.15],
            scale: isMirroring ? [0.95, 1.05, 0.95] : [0.98, 1.02, 0.98]
          }}
          transition={{ 
            duration: intensity === 'high-resistance' ? 4 : 8, 
            repeat: Infinity, 
            ease: "easeInOut" 
          }}
        />

        {/* 78 Connective Lines of Metatron's Cube */}
        <g stroke={glowColor} strokeWidth="0.08" opacity="0.3" filter="url(#glowFilter)">
          {connections.map((conn) => (
            <motion.line
              key={conn.key}
              x1={conn.x1}
              y1={conn.y1}
              x2={conn.x2}
              y2={conn.y2}
              initial={{ pathLength: 0 }}
              animate={{ pathLength: isMirroring ? 1 : 0.5 }}
              transition={{ 
                delay: conn.delay, 
                duration: isMirroring ? 1.8 : 2.5, 
                ease: "easeInOut" 
              }}
            />
          ))}
        </g>

        {/* The 13 Nodes (Spheres) of the Cube */}
        <g fill="#EDE8DF" filter="url(#glowFilter)">
          {nodes.map((node, idx) => (
            <motion.circle
              key={idx}
              cx={node.x}
              cy={node.y}
              r={idx === 0 ? 0.9 : 0.6} // Center node slightly larger
              fill={idx === 0 ? '#EDE8DF' : glowColor}
              opacity={idx === 0 ? 0.9 : 0.7}
              animate={{
                scale: isMirroring ? [1, 1.3, 1] : [1, 1.1, 1]
              }}
              transition={{
                duration: 2,
                repeat: Infinity,
                delay: idx * 0.05
              }}
            />
          ))}
        </g>

        {/* Twinkle Star Accents (Nodes 1, 3, 5 get small sparks) */}
        {[1, 3, 5].map((nodeIdx) => {
          const targetNode = nodes[nodeIdx];
          return (
            <g key={nodeIdx} transform={`translate(${targetNode.x}, ${targetNode.y})`}>
              <motion.path
                d="M -1.2 0 L 1.2 0 M 0 -1.2 L 0 1.2"
                stroke="white"
                strokeWidth="0.1"
                animate={{
                  opacity: [0.2, 1, 0.2],
                  scale: [0.7, 1.2, 0.7]
                }}
                transition={{
                  duration: 2.5 + nodeIdx * 0.3,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />
            </g>
          );
        })}
      </motion.svg>
    </div>
  );
};

export default MetatronsCube;
