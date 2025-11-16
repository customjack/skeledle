'use client';

import { AnatomicalPart } from '@/lib/models/AnatomicalPart';

interface BodyDiagramProps {
  highlightedPart?: AnatomicalPart;
}

export default function BodyDiagram({ highlightedPart }: BodyDiagramProps) {
  return (
    <div className="w-full max-w-md mx-auto">
      <svg
        viewBox="0 0 400 600"
        className="w-full h-auto"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* Simple human body outline */}
        <g id="body-outline" stroke="black" strokeWidth="2" fill="none">
          {/* Head */}
          <circle cx="200" cy="60" r="40" />

          {/* Neck */}
          <line x1="200" y1="100" x2="200" y2="130" />

          {/* Torso */}
          <rect x="160" y="130" width="80" height="120" rx="10" />

          {/* Arms */}
          <line x1="160" y1="150" x2="120" y2="200" />
          <line x1="120" y1="200" x2="110" y2="250" />
          <line x1="240" y1="150" x2="280" y2="200" />
          <line x1="280" y1="200" x2="290" y2="250" />

          {/* Legs */}
          <line x1="175" y1="250" x2="170" y2="350" />
          <line x1="170" y1="350" x2="165" y2="450" />
          <line x1="225" y1="250" x2="230" y2="350" />
          <line x1="230" y1="350" x2="235" y2="450" />
        </g>

        {/* Highlighted regions - these will be filled when matched */}
        {/* Head parts */}
        <ellipse
          id="skull-frontal"
          cx="200"
          cy="50"
          rx="30"
          ry="20"
          fill={highlightedPart?.svgPath === 'skull-frontal' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <ellipse
          id="skull-mandible"
          cx="200"
          cy="85"
          rx="25"
          ry="15"
          fill={highlightedPart?.svgPath === 'skull-mandible' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />

        {/* Thorax parts */}
        <rect
          id="thorax-sternum"
          x="190"
          y="140"
          width="20"
          height="60"
          fill={highlightedPart?.svgPath === 'thorax-sternum' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <ellipse
          id="organ-heart"
          cx="185"
          cy="165"
          rx="20"
          ry="25"
          fill={highlightedPart?.svgPath === 'organ-heart' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <ellipse
          id="organ-lungs"
          cx="200"
          cy="170"
          rx="35"
          ry="40"
          fill={highlightedPart?.svgPath === 'organ-lungs' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />

        {/* Shoulder */}
        <circle
          id="thorax-clavicle"
          cx="160"
          cy="135"
          r="10"
          fill={highlightedPart?.svgPath === 'thorax-clavicle' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <circle
          id="muscle-deltoid"
          cx="145"
          cy="150"
          r="15"
          fill={highlightedPart?.svgPath === 'muscle-deltoid' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />

        {/* Arms */}
        <line
          id="arm-humerus"
          x1="140"
          y1="175"
          x2="120"
          y2="200"
          stroke={highlightedPart?.svgPath === 'arm-humerus' ? '#ff6b6b' : 'transparent'}
          strokeWidth="12"
          opacity="0.6"
        />
        <ellipse
          id="muscle-biceps"
          cx="130"
          cy="185"
          rx="12"
          ry="20"
          fill={highlightedPart?.svgPath === 'muscle-biceps' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <line
          id="arm-radius"
          x1="120"
          y1="200"
          x2="115"
          y2="240"
          stroke={highlightedPart?.svgPath === 'arm-radius' ? '#ff6b6b' : 'transparent'}
          strokeWidth="8"
          opacity="0.6"
        />

        {/* Abdomen */}
        <ellipse
          id="organ-liver"
          cx="200"
          cy="220"
          rx="30"
          ry="20"
          fill={highlightedPart?.svgPath === 'organ-liver' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <ellipse
          id="organ-stomach"
          cx="185"
          cy="235"
          rx="20"
          ry="15"
          fill={highlightedPart?.svgPath === 'organ-stomach' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />

        {/* Legs */}
        <line
          id="leg-femur"
          x1="175"
          y1="260"
          x2="170"
          y2="340"
          stroke={highlightedPart?.svgPath === 'leg-femur' ? '#ff6b6b' : 'transparent'}
          strokeWidth="14"
          opacity="0.6"
        />
        <circle
          id="leg-patella"
          cx="170"
          cy="350"
          r="8"
          fill={highlightedPart?.svgPath === 'leg-patella' ? '#ff6b6b' : 'none'}
          opacity="0.6"
        />
        <line
          id="leg-tibia"
          x1="170"
          y1="360"
          x2="165"
          y2="440"
          stroke={highlightedPart?.svgPath === 'leg-tibia' ? '#ff6b6b' : 'transparent'}
          strokeWidth="10"
          opacity="0.6"
        />
      </svg>
    </div>
  );
}
