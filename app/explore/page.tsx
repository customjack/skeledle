'use client';

import { useState, useEffect, useRef, useMemo } from 'react';
import { AnatomyDatabase } from '@/lib/services/AnatomyDatabase';
import { AnatomicalPart } from '@/lib/models/AnatomicalPart';
import { getDiagramLabel } from '@/lib/utils/diagramMetadata';
import Link from 'next/link';

const DEFAULT_DIAGRAM = '/anatomical-images/Human_skeleton_front_-_no_labels.svg';

export default function ExplorePage() {
  const [database] = useState(() => AnatomyDatabase.getInstance());
  const [allParts, setAllParts] = useState<AnatomicalPart[]>([]);
  const [hoveredPart, setHoveredPart] = useState<AnatomicalPart | null>(null);
  const [clickedPart, setClickedPart] = useState<AnatomicalPart | null>(null);
  const [svgDoc, setSvgDoc] = useState<Document | null>(null);
  const [selectedDiagram, setSelectedDiagram] = useState<string | null>(null);
  const objectRef = useRef<HTMLObjectElement>(null);

  const diagramOptions = useMemo(() => {
    const unique: { file: string; label: string; count: number }[] = [];
    const indexMap = new Map<string, number>();

    allParts.forEach(part => {
      const file = part.svgFile || DEFAULT_DIAGRAM;
      const existingIndex = indexMap.get(file);

      if (existingIndex === undefined) {
        indexMap.set(file, unique.length);
        unique.push({
          file,
          label: getDiagramLabel(file),
          count: 1,
        });
      } else {
        unique[existingIndex].count += 1;
      }
    });

    return unique;
  }, [allParts]);

  const currentDiagram = selectedDiagram ?? diagramOptions[0]?.file ?? DEFAULT_DIAGRAM;
  const currentDiagramLabel = getDiagramLabel(currentDiagram);

  const diagramParts = useMemo(
    () => allParts.filter(part => part.svgFile === currentDiagram),
    [allParts, currentDiagram]
  );

  useEffect(() => {
    setAllParts(database.getAllParts());
  }, [database]);

  useEffect(() => {
    if (diagramOptions.length === 0) return;
    if (!selectedDiagram || !diagramOptions.some(option => option.file === selectedDiagram)) {
      setSelectedDiagram(diagramOptions[0].file);
    }
  }, [diagramOptions, selectedDiagram]);

  useEffect(() => {
    if (!currentDiagram) return;

    setSvgDoc(null);

    const loadSvg = () => {
      if (objectRef.current?.contentDocument) {
        setSvgDoc(objectRef.current.contentDocument);
      }
    };

    const obj = objectRef.current;
    if (obj) {
      obj.addEventListener('load', loadSvg);
      loadSvg();
    }

    return () => {
      if (obj) {
        obj.removeEventListener('load', loadSvg);
      }
    };
  }, [currentDiagram]);

  useEffect(() => {
    setHoveredPart(null);
    setClickedPart(null);
  }, [currentDiagram]);

  // Add hover listeners to SVG elements
  useEffect(() => {
    if (!svgDoc || diagramParts.length === 0) return;

    let hoverTimeout: ReturnType<typeof setTimeout>;
    let currentHoveredId: string | null = null;

    const handleSvgMouseOver = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      const elementId = target.id || target.parentElement?.id;

      if (elementId && elementId !== currentHoveredId) {
        currentHoveredId = elementId;

        // Clear any pending timeout
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }

        // Debounce the hover state change
        hoverTimeout = setTimeout(() => {
          const part = diagramParts.find(p => p.getSvgPaths().includes(elementId));
          if (part && !clickedPart) {
            setHoveredPart(part);
          }
        }, 50); // 50ms debounce
      }
    };

    const handleSvgMouseOut = (e: MouseEvent) => {
      const relatedTarget = e.relatedTarget as SVGElement;
      const relatedId = relatedTarget?.id || relatedTarget?.parentElement?.id;

      // Only clear if we're not moving to another valid element
      if (!relatedId || !diagramParts.find(p => p.getSvgPaths().includes(relatedId))) {
        currentHoveredId = null;
        if (hoverTimeout) {
          clearTimeout(hoverTimeout);
        }
        if (!clickedPart) {
          setHoveredPart(null);
        }
      }
    };

    const handleSvgClick = (e: MouseEvent) => {
      const target = e.target as SVGElement;
      const elementId = target.id || target.parentElement?.id;

      if (elementId) {
        const part = diagramParts.find(p => p.getSvgPaths().includes(elementId));
        if (part) {
          setClickedPart(part === clickedPart ? null : part);
          setHoveredPart(null);
        }
      }
    };

    const svgElement = svgDoc.documentElement;
    svgElement.addEventListener('mouseover', handleSvgMouseOver as EventListener);
    svgElement.addEventListener('mouseout', handleSvgMouseOut as EventListener);
    svgElement.addEventListener('click', handleSvgClick as EventListener);

    // Make SVG elements interactive
    diagramParts.forEach(part => {
      part.getSvgPaths().forEach(svgPath => {
        const element = svgDoc.getElementById(svgPath);
        if (element) {
          element.style.cursor = 'pointer';
        }
      });
    });

    return () => {
      svgElement.removeEventListener('mouseover', handleSvgMouseOver as EventListener);
      svgElement.removeEventListener('mouseout', handleSvgMouseOut as EventListener);
      svgElement.removeEventListener('click', handleSvgClick as EventListener);
      if (hoverTimeout) {
        clearTimeout(hoverTimeout);
      }
    };
  }, [svgDoc, diagramParts, clickedPart]);

  // Highlight the hovered or clicked part
  useEffect(() => {
    if (!svgDoc) return;

    // Reset all highlights
    const allElements = svgDoc.querySelectorAll('[data-explored="true"]');
    allElements.forEach((el) => {
      (el as HTMLElement).removeAttribute('data-explored');
      (el as SVGElement).style.fill = '';
      (el as SVGElement).style.fillOpacity = '';
      (el as SVGElement).style.opacity = '';
      (el as SVGElement).style.stroke = '';
      (el as SVGElement).style.strokeWidth = '';
      (el as SVGElement).style.filter = '';

      // Reset child elements too
      const children = (el as SVGElement).querySelectorAll('*');
      children.forEach((child) => {
        (child as SVGElement).style.fill = '';
        (child as SVGElement).style.fillOpacity = '';
        (child as SVGElement).style.stroke = '';
        (child as SVGElement).style.strokeWidth = '';
      });
    });

    const displayPart = clickedPart || hoveredPart;
    if (displayPart) {
      const svgPaths = displayPart.getSvgPaths();
      const isClicked = !!clickedPart;
      const fillColor = isClicked ? '#4ade80' : '#60a5fa';
      const strokeColor = isClicked ? '#22c55e' : '#3b82f6';

      svgPaths.forEach(svgPath => {
        const targetElement = svgDoc.getElementById(svgPath);
        if (targetElement) {
          targetElement.setAttribute('data-explored', 'true');

          // More visible highlighting with glow effect
          (targetElement as unknown as SVGElement).style.fill = fillColor;
          (targetElement as unknown as SVGElement).style.fillOpacity = '0.8';
          (targetElement as unknown as SVGElement).style.stroke = strokeColor;
          (targetElement as unknown as SVGElement).style.strokeWidth = '4';
          (targetElement as unknown as SVGElement).style.filter = `drop-shadow(0 0 8px ${strokeColor})`;

          // Highlight all child elements too (for complex shapes)
          const children = targetElement.querySelectorAll('*');
          children.forEach((child) => {
            (child as SVGElement).style.fill = fillColor;
            (child as SVGElement).style.fillOpacity = '0.8';
            (child as SVGElement).style.stroke = strokeColor;
            (child as SVGElement).style.strokeWidth = '2';
          });
        }
      });
    }
  }, [svgDoc, hoveredPart, clickedPart, currentDiagram]);

  const handlePartClick = (part: AnatomicalPart) => {
    setClickedPart(part === clickedPart ? null : part);
    // Clear hover state when clicking
    setHoveredPart(null);
  };

  const displayPart =
    (clickedPart && clickedPart.svgFile === currentDiagram ? clickedPart : null) ||
    (hoveredPart && hoveredPart.svgFile === currentDiagram ? hoveredPart : null);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-blue-600 mb-2">Explorer Mode</h1>
            <p className="text-gray-600">
              Hover over bones to see their names, click to pin them, and use the diagram picker to cycle through each asset.
            </p>
          </div>
          <Link
            href="/"
            className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Game
          </Link>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          {/* SVG Diagram - Takes up 2 columns */}
          <div className="lg:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-2">
                Interactive Anatomy Viewer
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Current Diagram:{' '}
                <span className="font-semibold text-gray-900">{currentDiagramLabel}</span>
              </p>
              {diagramOptions.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                  {diagramOptions.map(option => (
                    <button
                      key={option.file}
                      onClick={() => setSelectedDiagram(option.file)}
                      className={`px-3 py-1 rounded-full border text-sm transition-colors ${
                        currentDiagram === option.file
                          ? 'bg-blue-600 text-white border-blue-600'
                          : 'bg-white text-gray-700 border-gray-300 hover:bg-gray-100'
                      }`}
                    >
                      {option.label}
                      <span className="ml-2 text-xs opacity-80">
                        ({option.count})
                      </span>
                    </button>
                  ))}
                </div>
              )}
              <div className="bg-gray-50 rounded-lg p-4">
                <object
                  key={currentDiagram}
                  ref={objectRef}
                  data={currentDiagram}
                  type="image/svg+xml"
                  className="w-full h-auto"
                  aria-label="Interactive anatomical diagram"
                >
                  <div className="text-center p-8">
                    Loading anatomy diagram...
                  </div>
                </object>
              </div>
              <div className="mt-4 text-sm text-gray-600">
                <div className="flex gap-4 items-center">
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-blue-400 rounded"></div>
                    <span>Hover</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-6 h-6 bg-green-400 rounded"></div>
                    <span>Clicked/Pinned</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Info Panel - Takes up 1 column */}
          <div className="space-y-6">
            {/* Current Part Info */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {displayPart ? 'Part Information' : 'Hover over a bone'}
              </h2>
              {displayPart ? (
                <div className="space-y-3">
                  <div>
                    <div className="text-sm text-gray-500">Medical Name</div>
                    <div className="text-2xl font-bold text-blue-600">
                      {displayPart.name}
                    </div>
                  </div>
                  <div>
                    <div className="text-sm text-gray-500">Common Name</div>
                    <div className="text-lg font-semibold">
                      {displayPart.commonName}
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-3 pt-3 border-t">
                    <div>
                      <div className="text-sm text-gray-500">System</div>
                      <div className="font-medium capitalize">
                        {displayPart.system}
                      </div>
                    </div>
                    <div>
                      <div className="text-sm text-gray-500">Region</div>
                      <div className="font-medium capitalize">
                        {displayPart.region.replace('_', ' ')}
                      </div>
                    </div>
                  </div>
                  {displayPart.aliases.length > 0 && (
                    <div className="pt-3 border-t">
                      <div className="text-sm text-gray-500 mb-1">Also known as</div>
                      <div className="text-sm">
                        {displayPart.aliases.join(', ')}
                      </div>
                    </div>
                  )}
                  {clickedPart && (
                    <button
                      onClick={() => setClickedPart(null)}
                      className="w-full mt-4 px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300 transition-colors"
                    >
                      Unpin
                    </button>
                  )}
                </div>
              ) : (
                <p className="text-gray-500">
                  Move your mouse over the skeleton to explore different bones and see their information.
                </p>
              )}
            </div>

            {/* All Parts List */}
            <div className="bg-white p-6 rounded-lg shadow-lg max-h-96 overflow-y-auto">
              <h2 className="text-xl font-bold mb-2">
                Parts in Diagram ({diagramParts.length})
              </h2>
              <p className="text-sm text-gray-600 mb-4">
                Switch diagrams above to review other annotations.
              </p>
              <div className="space-y-1">
                {diagramParts.length === 0 ? (
                  <p className="text-sm text-gray-500">
                    No parts are associated with this diagram yet.
                  </p>
                ) : (
                  diagramParts.map((part) => (
                    <button
                      key={part.id}
                      onClick={() => handlePartClick(part)}
                      className={`w-full text-left px-3 py-2 rounded transition-colors ${
                        clickedPart?.id === part.id
                          ? 'bg-green-100 text-green-800'
                          : 'hover:bg-gray-100'
                      }`}
                    >
                      <div className="font-medium">{part.name}</div>
                      <div className="text-xs text-gray-600">{part.commonName}</div>
                    </button>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
