'use client';

import { AnatomicalPart } from '@/lib/models/AnatomicalPart';
import { useEffect, useRef, useState } from 'react';

interface BodyDiagramSVGProps {
  highlightedPart?: AnatomicalPart;
  svgFile?: string; // e.g., "skeleton-front.svg"
}

/**
 * Component that loads an external SVG and highlights specific elements
 *
 * To use:
 * 1. Download SVG files from Wikimedia Commons to public/anatomical-images/
 * 2. Ensure SVG elements have IDs matching anatomical part names
 * 3. Set svgElementId in AnatomicalPart to match the SVG element ID
 */
export default function BodyDiagramSVG({
  highlightedPart,
  svgFile
}: BodyDiagramSVGProps) {
  const objectRef = useRef<HTMLObjectElement>(null);
  const [svgDoc, setSvgDoc] = useState<Document | null>(null);

  // Use the svgFile from highlightedPart if available, otherwise use default
  const actualSvgFile = highlightedPart?.svgFile || svgFile || '/anatomical-images/Human_skeleton_front_-_no_labels.svg';

  useEffect(() => {
    const loadSvg = () => {
      if (objectRef.current?.contentDocument) {
        setSvgDoc(objectRef.current.contentDocument);
      }
    };

    // Wait for SVG to load
    const obj = objectRef.current;
    if (obj) {
      obj.addEventListener('load', loadSvg);
      // Try loading immediately in case it's already loaded
      loadSvg();
    }

    return () => {
      if (obj) {
        obj.removeEventListener('load', loadSvg);
      }
    };
  }, [actualSvgFile]);

  useEffect(() => {
    if (!svgDoc || !highlightedPart) return;

    // Reset all highlights
    const allElements = svgDoc.querySelectorAll('[data-highlighted="true"]');
    allElements.forEach((el) => {
      (el as HTMLElement).removeAttribute('data-highlighted');
      (el as SVGElement).style.fill = '';
      (el as SVGElement).style.fillOpacity = '';
      (el as SVGElement).style.opacity = '';
      (el as SVGElement).style.stroke = '';
      (el as SVGElement).style.strokeWidth = '';
      (el as SVGElement).style.filter = '';

      // Reset child elements
      const children = (el as SVGElement).querySelectorAll('*');
      children.forEach((child) => {
        (child as SVGElement).style.fill = '';
        (child as SVGElement).style.fillOpacity = '';
        (child as SVGElement).style.stroke = '';
        (child as SVGElement).style.strokeWidth = '';
      });
    });

    // Highlight the target element(s)
    const svgPaths = highlightedPart.getSvgPaths();
    let foundAny = false;

    svgPaths.forEach((svgPath) => {
      const targetElement = svgDoc.getElementById(svgPath);
      if (targetElement) {
        foundAny = true;
        targetElement.setAttribute('data-highlighted', 'true');

        // More visible highlighting with glow effect
        (targetElement as SVGElement).style.fill = '#ff6b6b';
        (targetElement as SVGElement).style.fillOpacity = '0.8';
        (targetElement as SVGElement).style.stroke = '#ff0000';
        (targetElement as SVGElement).style.strokeWidth = '4';
        (targetElement as SVGElement).style.filter = 'drop-shadow(0 0 8px #ff0000)';

        // Highlight all child elements too (for complex shapes)
        const children = targetElement.querySelectorAll('*');
        children.forEach((child) => {
          (child as SVGElement).style.fill = '#ff6b6b';
          (child as SVGElement).style.fillOpacity = '0.8';
          (child as SVGElement).style.stroke = '#ff0000';
          (child as SVGElement).style.strokeWidth = '2';
        });
      }
    });

    if (!foundAny) {
      console.warn(`SVG element(s) with id(s) "${svgPaths.join(', ')}" not found`);
    }
  }, [svgDoc, highlightedPart]);

  return (
    <div className="w-full max-w-2xl mx-auto">
      <object
        ref={objectRef}
        data={actualSvgFile}
        type="image/svg+xml"
        className="w-full h-auto"
        aria-label="Anatomical diagram"
      >
        {/* Fallback content if SVG fails to load */}
        <div className="text-center p-8 bg-gray-100 rounded">
          <p className="text-gray-600 mb-4">
            SVG file not found. Using placeholder diagram.
          </p>
          <div className="text-sm text-gray-500">
            Expected file: <code>{actualSvgFile}</code>
          </div>

          {/* Simple placeholder */}
          <svg
            viewBox="0 0 400 600"
            className="w-full h-auto mt-4 max-w-md mx-auto"
            xmlns="http://www.w3.org/2000/svg"
          >
            <g stroke="black" strokeWidth="2" fill="none">
              <circle cx="200" cy="60" r="40" />
              <line x1="200" y1="100" x2="200" y2="130" />
              <rect x="160" y="130" width="80" height="120" rx="10" />
              <line x1="160" y1="150" x2="120" y2="200" />
              <line x1="120" y1="200" x2="110" y2="250" />
              <line x1="240" y1="150" x2="280" y2="200" />
              <line x1="280" y1="200" x2="290" y2="250" />
              <line x1="175" y1="250" x2="170" y2="350" />
              <line x1="170" y1="350" x2="165" y2="450" />
              <line x1="225" y1="250" x2="230" y2="350" />
              <line x1="230" y1="350" x2="235" y2="450" />
            </g>

            {highlightedPart && (
              <text x="200" y="500" textAnchor="middle" className="text-sm fill-red-600">
                {highlightedPart.name}
              </text>
            )}
          </svg>
        </div>
      </object>

      {highlightedPart && (
        <div className="mt-4 text-center text-sm text-gray-600">
          Highlighting: <strong>{highlightedPart.name}</strong>
          <br />
          <span className="text-xs">
            SVG Element ID(s): <code className="bg-gray-100 px-1">{highlightedPart.getSvgPaths().join(', ')}</code>
          </span>
        </div>
      )}
    </div>
  );
}
