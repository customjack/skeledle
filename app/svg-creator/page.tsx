'use client';

import { useState, useRef, useEffect } from 'react';
import Link from 'next/link';

interface Point {
  x: number;
  y: number;
}

interface Region {
  id: string;
  label: string;
  points: Point[];
  color: string;
  groupId?: string; // For grouping multiple regions under one label
}

type Tool = 'draw' | 'pan' | 'select';

export default function SVGCreator() {
  const [image, setImage] = useState<string | null>(null);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  const [regions, setRegions] = useState<Region[]>([]);
  const [currentRegion, setCurrentRegion] = useState<Point[]>([]);
  const [selectedRegionId, setSelectedRegionId] = useState<string | null>(null);
  const [labelInput, setLabelInput] = useState('');
  const [currentGroupId, setCurrentGroupId] = useState<string | null>(null);
  const [addingToGroup, setAddingToGroup] = useState(false);
  const [editingGroupId, setEditingGroupId] = useState<string | null>(null);
  const [editingGroupLabel, setEditingGroupLabel] = useState('');
  const [zoom, setZoom] = useState(1);
  const [pan, setPan] = useState({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState(false);
  const [panStart, setPanStart] = useState({ x: 0, y: 0 });
  const [activeTool, setActiveTool] = useState<Tool>('draw');
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getRandomColor = () => {
    const colors = ['#ff6b6b', '#4ecdc4', '#45b7d1', '#f7b731', '#5f27cd', '#00d2d3', '#ff9ff3'];
    return colors[Math.floor(Math.random() * colors.length)];
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const img = new Image();
      img.onload = () => {
        setImageDimensions({ width: img.width, height: img.height });
        setImage(event.target?.result as string);
      };
      img.src = event.target?.result as string;
    };
    reader.readAsDataURL(file);
  };

  const handleCanvasClick = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current || isPanning) return;

    // Only draw points if in draw mode
    if (activeTool !== 'draw') return;

    const rect = canvasRef.current.getBoundingClientRect();

    // Convert screen coordinates to image coordinates accounting for zoom and pan
    const canvasX = (e.clientX - rect.left);
    const canvasY = (e.clientY - rect.top);

    const x = (canvasX - pan.x) / zoom;
    const y = (canvasY - pan.y) / zoom;

    setCurrentRegion([...currentRegion, { x, y }]);
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    // Pan with right/middle click, or left click if pan tool is active
    if (e.button === 2 || e.button === 1 || (e.button === 0 && activeTool === 'pan')) {
      setIsPanning(true);
      setPanStart({ x: e.clientX - pan.x, y: e.clientY - pan.y });
      e.preventDefault();
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (isPanning) {
      e.preventDefault();
      setPan({
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      });
    }
  };

  const handleMouseUp = () => {
    setIsPanning(false);
  };

  const handleContextMenu = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault(); // Prevent context menu on right click
  };

  const handleZoomChange = (newZoom: number) => {
    setZoom(Math.max(0.1, Math.min(10, newZoom)));
  };

  const resetView = () => {
    setZoom(1);
    setPan({ x: 0, y: 0 });
  };

  const getCursorStyle = () => {
    if (isPanning) return 'cursor-grabbing';
    if (activeTool === 'pan') return 'cursor-grab';
    if (activeTool === 'select') return 'cursor-pointer';
    return 'cursor-crosshair';
  };

  const finishRegion = () => {
    if (currentRegion.length < 3) {
      alert('Need at least 3 points to create a region');
      return;
    }

    // Determine groupId and color
    let groupId = currentGroupId;
    let color = getRandomColor();
    let label = labelInput || `Region ${regions.length + 1}`;

    // If adding to a group, use the existing group's color and label
    if (addingToGroup && currentGroupId) {
      const existingGroupRegion = regions.find(r => r.groupId === currentGroupId);
      if (existingGroupRegion) {
        color = existingGroupRegion.color;
        label = existingGroupRegion.label;
      }
    } else if (!currentGroupId) {
      // Starting a new group
      groupId = `group-${Date.now()}`;
      setCurrentGroupId(groupId);
    }

    const newRegion: Region = {
      id: `region-${Date.now()}-${Math.random()}`,
      label,
      points: currentRegion,
      color,
      groupId,
    };

    setRegions([...regions, newRegion]);
    setCurrentRegion([]);

    // If not adding to group, clear the label and group
    if (!addingToGroup) {
      setLabelInput('');
      setCurrentGroupId(null);
    }
  };

  const finishGroup = () => {
    setAddingToGroup(false);
    setCurrentGroupId(null);
    setLabelInput('');
  };

  const deleteGroup = (groupId: string) => {
    setRegions(regions.filter(r => r.groupId !== groupId));
    if (currentGroupId === groupId) {
      setCurrentGroupId(null);
      setAddingToGroup(false);
    }
  };

  const startAddingToGroup = (groupId: string) => {
    const group = regions.find(r => r.groupId === groupId);
    if (group) {
      setCurrentGroupId(groupId);
      setAddingToGroup(true);
      setLabelInput(group.label);
    }
  };

  const startEditingGroup = (groupId: string) => {
    const group = regions.find(r => r.groupId === groupId);
    if (group) {
      setEditingGroupId(groupId);
      setEditingGroupLabel(group.label);
    }
  };

  const saveGroupLabel = (groupId: string) => {
    setRegions(regions.map(r =>
      r.groupId === groupId ? { ...r, label: editingGroupLabel } : r
    ));
    setEditingGroupId(null);
    setEditingGroupLabel('');
  };

  const cancelEditingGroup = () => {
    setEditingGroupId(null);
    setEditingGroupLabel('');
  };

  const deleteRegion = (id: string) => {
    setRegions(regions.filter(r => r.id !== id));
    if (selectedRegionId === id) {
      setSelectedRegionId(null);
    }
  };

  const slugifyLabel = (label: string, fallback: string) => {
    const base = label
      .trim()
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/^-+|-+$/g, '');
    return base || fallback;
  };

  interface RegionGroup {
    groupId: string;
    label: string;
    regions: Region[];
    slug: string;
  }

  const getGroupedRegions = (): RegionGroup[] => {
    const groupMap = regions.reduce((acc, region) => {
      const key = region.groupId || region.id;
      if (!acc.has(key)) {
        acc.set(key, {
          groupId: key,
          label: region.label,
          regions: [region],
        });
      } else {
        acc.get(key)!.regions.push(region);
      }
      return acc;
    }, new Map<string, { groupId: string; label: string; regions: Region[] }>());

    const slugCounts = new Map<string, number>();
    const getUniqueSlug = (label: string, fallback: string) => {
      const base = slugifyLabel(label, fallback);
      const currentCount = slugCounts.get(base) ?? 0;
      slugCounts.set(base, currentCount + 1);
      return currentCount === 0 ? base : `${base}-${currentCount + 1}`;
    };

    return Array.from(groupMap.values()).map(group => ({
      ...group,
      slug: getUniqueSlug(group.label, group.groupId),
    }));
  };

  const exportSVG = () => {
    if (!imageDimensions.width || !imageDimensions.height) {
      alert('Please upload an image first');
      return;
    }

    const groups = getGroupedRegions();

    const renderGroup = (group: RegionGroup) => {
      const polygons = group.regions.map(region => {
        const pointsStr = region.points.map(p => `${p.x},${p.y}`).join(' ');
        return `    <polygon id="${region.id}" class="region" data-label="${region.label}" points="${pointsStr}" />`;
      }).join('\n');
      return `  <g id="${group.slug}" data-label="${group.label}" data-group-id="${group.groupId}">\n${polygons}\n  </g>`;
    };

    const svgContent = `<?xml version="1.0" encoding="UTF-8"?>
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${imageDimensions.width} ${imageDimensions.height}" width="${imageDimensions.width}" height="${imageDimensions.height}">
  <defs>
    <style>
      .region { fill: #f0e6d2; stroke: #8b7355; stroke-width: 2; opacity: 0.3; cursor: pointer; }
      .region:hover { opacity: 0.6; }
    </style>
  </defs>

  <!-- Embedded image -->
  <image href="${image}" width="${imageDimensions.width}" height="${imageDimensions.height}" />

  <!-- Regions -->
${groups.map(renderGroup).join('\n')}
</svg>`;

    const blob = new Blob([svgContent], { type: 'image/svg+xml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'anatomical-diagram.svg';
    a.click();
    URL.revokeObjectURL(url);
  };

  const exportRegionList = () => {
    const groups = getGroupedRegions();
    const groupedMapping = groups.map(group => {
      const svgElementIds = group.regions.map(r => r.id);
      return {
        label: group.label,
        svgGroupId: group.slug,
        svgElementIds: svgElementIds.length === 1 ? svgElementIds[0] : svgElementIds,
        regionCount: group.regions.length,
      };
    });

    const blob = new Blob([JSON.stringify(groupedMapping, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'region-mapping.json';
    a.click();
    URL.revokeObjectURL(url);
  };

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'd' || e.key === 'D') {
        setActiveTool('draw');
      } else if (e.key === 'p' || e.key === 'P') {
        setActiveTool('pan');
      } else if (e.key === 's' || e.key === 'S') {
        setActiveTool('select');
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Draw on canvas
  useEffect(() => {
    if (!canvasRef.current || !image || !containerRef.current) return;

    const canvas = canvasRef.current;
    const container = containerRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const img = new Image();
    img.onload = () => {
      // Set canvas to fill container
      const containerWidth = container.clientWidth;
      const containerHeight = container.clientHeight;

      canvas.width = containerWidth;
      canvas.height = containerHeight;

      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Apply transformations
      ctx.save();
      ctx.translate(pan.x, pan.y);
      ctx.scale(zoom, zoom);

      // Draw image
      ctx.drawImage(img, 0, 0, imageDimensions.width, imageDimensions.height);

      // Draw completed regions
      regions.forEach((region) => {
        ctx.beginPath();
        ctx.moveTo(region.points[0].x, region.points[0].y);
        region.points.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y);
        });
        ctx.closePath();
        ctx.fillStyle = region.color + '40';
        ctx.fill();
        ctx.strokeStyle = region.color;
        ctx.lineWidth = 3 / zoom;
        ctx.stroke();

        // Draw label
        const centerX = region.points.reduce((sum, p) => sum + p.x, 0) / region.points.length;
        const centerY = region.points.reduce((sum, p) => sum + p.y, 0) / region.points.length;
        ctx.fillStyle = '#000';
        ctx.font = `${16 / zoom}px Arial`;
        ctx.textAlign = 'center';
        ctx.fillText(region.label, centerX, centerY);
      });

      // Draw current region being drawn
      if (currentRegion.length > 0) {
        ctx.beginPath();
        ctx.moveTo(currentRegion[0].x, currentRegion[0].y);
        currentRegion.forEach((point, i) => {
          if (i > 0) ctx.lineTo(point.x, point.y);

          // Draw point markers
          ctx.fillStyle = '#ff0000';
          ctx.beginPath();
          ctx.arc(point.x, point.y, 5 / zoom, 0, Math.PI * 2);
          ctx.fill();
        });
        ctx.strokeStyle = '#ff0000';
        ctx.lineWidth = 2 / zoom;
        ctx.stroke();
      }

      ctx.restore();
    };
    img.src = image;
  }, [image, regions, currentRegion, imageDimensions, zoom, pan]);

  return (
    <main className="min-h-screen p-8 bg-gray-50">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6 flex justify-between items-center">
          <h1 className="text-4xl font-bold text-blue-600">SVG Annotation Tool</h1>
          <Link
            href="/"
            className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
          >
            Back to Game
          </Link>
        </div>

        <div className="grid md:grid-cols-3 gap-6">
          {/* Left side - Canvas */}
          <div className="md:col-span-2">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-2xl font-bold mb-4">Canvas</h2>

              {!image ? (
                <div className="border-4 border-dashed border-gray-300 rounded-lg p-12 text-center">
                  <input
                    ref={fileInputRef}
                    type="file"
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                  />
                  <button
                    onClick={() => fileInputRef.current?.click()}
                    className="px-8 py-4 bg-blue-600 text-white text-lg font-semibold rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Upload Image
                  </button>
                  <p className="mt-4 text-gray-600">
                    Upload a medical diagram to start annotating
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {/* Tool Selection */}
                  <div className="flex gap-2 bg-white p-2 rounded-lg border border-gray-300">
                    <button
                      onClick={() => setActiveTool('draw')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        activeTool === 'draw'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Draw (D)
                    </button>
                    <button
                      onClick={() => setActiveTool('pan')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        activeTool === 'pan'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Pan (P)
                    </button>
                    <button
                      onClick={() => setActiveTool('select')}
                      className={`px-4 py-2 rounded-lg font-semibold transition-colors ${
                        activeTool === 'select'
                          ? 'bg-blue-600 text-white'
                          : 'bg-gray-200 text-gray-800 hover:bg-gray-300'
                      }`}
                    >
                      Select (S)
                    </button>
                  </div>

                  <div
                    ref={containerRef}
                    className="border-4 border-gray-300 bg-gray-100 overflow-hidden"
                    style={{ width: '100%', height: '600px', position: 'relative' }}
                  >
                    <canvas
                      ref={canvasRef}
                      onClick={handleCanvasClick}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                      onContextMenu={handleContextMenu}
                      className={getCursorStyle()}
                      style={{ display: 'block', touchAction: 'none', outline: 'none' }}
                    />
                  </div>

                  <div className="flex gap-2 flex-wrap items-center bg-gray-50 p-4 rounded-lg">
                    <button
                      onClick={() => handleZoomChange(zoom * 0.8)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      -
                    </button>

                    <input
                      type="range"
                      min="10"
                      max="1000"
                      value={zoom * 100}
                      onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
                      className="flex-1 min-w-[150px]"
                    />

                    <input
                      type="number"
                      min="10"
                      max="1000"
                      value={Math.round(zoom * 100)}
                      onChange={(e) => handleZoomChange(Number(e.target.value) / 100)}
                      className="w-20 px-2 py-2 border border-gray-300 rounded-lg text-center"
                    />
                    <span className="text-gray-600 font-medium">%</span>

                    <button
                      onClick={() => handleZoomChange(zoom * 1.2)}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      +
                    </button>

                    <button
                      onClick={resetView}
                      className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                    >
                      Reset View
                    </button>
                  </div>

                  <div className="flex gap-2 flex-wrap">
                    <button
                      onClick={() => setCurrentRegion([])}
                      className="px-4 py-2 bg-yellow-600 text-white rounded-lg hover:bg-yellow-700 transition-colors"
                      disabled={currentRegion.length === 0}
                    >
                      Clear Points ({currentRegion.length})
                    </button>
                    <button
                      onClick={finishRegion}
                      className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                      disabled={currentRegion.length < 3}
                    >
                      Finish Region
                    </button>
                    <button
                      onClick={() => fileInputRef.current?.click()}
                      className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors"
                    >
                      Change Image
                    </button>
                  </div>

                  <div className="text-sm text-gray-600 bg-gray-100 p-3 rounded">
                    <strong>Controls:</strong>
                    <ul className="list-disc list-inside mt-1">
                      <li><strong>D</strong> - Draw tool (add polygon points)</li>
                      <li><strong>P</strong> - Pan tool (drag to move view)</li>
                      <li><strong>S</strong> - Select tool (click regions)</li>
                      <li><strong>Right-click drag</strong> - Pan (any tool)</li>
                      <li><strong>Zoom controls</strong> - Use slider, input, or +/- buttons above</li>
                    </ul>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Right side - Controls */}
          <div className="space-y-6">
            {/* Current Region Input */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                {addingToGroup ? 'Adding to Group' : 'New Region'}
              </h2>
              {addingToGroup && (
                <div className="mb-3 p-3 bg-blue-50 border border-blue-200 rounded-lg">
                  <p className="text-sm text-blue-800 font-semibold">
                    Adding regions to: {regions.find(r => r.groupId === currentGroupId)?.label}
                  </p>
                  <p className="text-xs text-blue-600 mt-1">
                    Draw more polygons for this label
                  </p>
                </div>
              )}
              <input
                type="text"
                value={labelInput}
                onChange={(e) => setLabelInput(e.target.value)}
                placeholder="Region label (e.g., 'Distal Phalanges')"
                className="w-full px-3 py-2 border border-gray-300 rounded-lg mb-2"
                disabled={addingToGroup}
              />
              <p className="text-sm text-gray-600 mb-3">
                Click on the canvas to add points. Need at least 3 points to create a region.
              </p>
              {currentGroupId && !addingToGroup && (
                <button
                  onClick={() => setAddingToGroup(true)}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors mb-2"
                >
                  Add Another Region to This Label
                </button>
              )}
              {addingToGroup && (
                <button
                  onClick={finishGroup}
                  className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
                >
                  Done Adding Regions
                </button>
              )}
            </div>

            {/* Regions List */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">
                Groups ({[...new Set(regions.map(r => r.groupId))].length})
              </h2>
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {[...new Set(regions.map(r => r.groupId))].map((groupId) => {
                  const groupRegions = regions.filter(r => r.groupId === groupId);
                  const label = groupRegions[0]?.label || 'Unknown';
                  const isEditing = editingGroupId === groupId;
                  const isCurrentGroup = currentGroupId === groupId && addingToGroup;

                  return (
                    <div
                      key={groupId}
                      className={`border-2 rounded-lg p-3 ${
                        isCurrentGroup ? 'border-blue-500 bg-blue-50' : 'border-gray-300 bg-gray-50'
                      }`}
                    >
                      <div className="flex justify-between items-start mb-2">
                        <div className="flex-1">
                          {isEditing ? (
                            <div className="flex gap-2">
                              <input
                                type="text"
                                value={editingGroupLabel}
                                onChange={(e) => setEditingGroupLabel(e.target.value)}
                                className="flex-1 px-2 py-1 border border-gray-300 rounded text-sm"
                                autoFocus
                              />
                              <button
                                onClick={() => saveGroupLabel(groupId!)}
                                className="px-2 py-1 bg-green-600 text-white text-xs rounded hover:bg-green-700"
                              >
                                Save
                              </button>
                              <button
                                onClick={cancelEditingGroup}
                                className="px-2 py-1 bg-gray-500 text-white text-xs rounded hover:bg-gray-600"
                              >
                                Cancel
                              </button>
                            </div>
                          ) : (
                            <>
                              <div className="font-semibold text-lg">{label}</div>
                              <div className="text-xs text-gray-600">
                                {groupRegions.length} region{groupRegions.length > 1 ? 's' : ''}
                              </div>
                            </>
                          )}
                        </div>
                        {!isEditing && (
                          <button
                            onClick={() => deleteGroup(groupId!)}
                            className="px-3 py-1 bg-red-600 text-white text-sm rounded hover:bg-red-700 ml-2"
                          >
                            Delete All
                          </button>
                        )}
                      </div>

                      {!isEditing && (
                        <div className="flex gap-2 mb-2">
                          <button
                            onClick={() => startAddingToGroup(groupId!)}
                            className="flex-1 px-3 py-2 bg-blue-600 text-white text-sm rounded hover:bg-blue-700 transition-colors"
                            disabled={isCurrentGroup}
                          >
                            {isCurrentGroup ? 'Currently Adding...' : 'Add More Regions'}
                          </button>
                          <button
                            onClick={() => startEditingGroup(groupId!)}
                            className="px-3 py-2 bg-gray-600 text-white text-sm rounded hover:bg-gray-700 transition-colors"
                          >
                            Rename
                          </button>
                        </div>
                      )}

                      <div className="space-y-1">
                        {groupRegions.map((region, idx) => (
                          <div
                            key={region.id}
                            className="flex justify-between items-center p-2 bg-white border border-gray-200 rounded text-sm"
                          >
                            <div className="flex items-center gap-2">
                              <div
                                className="w-4 h-4 rounded"
                                style={{ backgroundColor: region.color }}
                              ></div>
                              <span className="text-gray-700">Part {idx + 1}</span>
                            </div>
                            <button
                              onClick={() => deleteRegion(region.id)}
                              className="px-2 py-1 bg-red-500 text-white text-xs rounded hover:bg-red-600"
                            >
                              Delete
                            </button>
                          </div>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Export */}
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h2 className="text-xl font-bold mb-4">Export</h2>
              <div className="space-y-2">
                <button
                  onClick={exportSVG}
                  className="w-full px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  disabled={regions.length === 0}
                >
                  Download SVG
                </button>
                <button
                  onClick={exportRegionList}
                  className="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
                  disabled={regions.length === 0}
                >
                  Download Region List (JSON)
                </button>
              </div>
              <p className="text-xs text-gray-600 mt-2">
                The SVG file will have clickable regions with IDs. Use the region list to map IDs to your database.
              </p>
            </div>
          </div>
        </div>

        {/* Instructions */}
        <div className="mt-6 bg-white p-6 rounded-lg shadow-lg">
          <h2 className="text-xl font-bold mb-4">How to Use</h2>
          <ol className="list-decimal list-inside space-y-2 text-gray-700">
            <li>Upload a medical diagram image (PNG, JPG, etc.)</li>
            <li>Click on the canvas to create polygon points around a body part</li>
            <li>Enter a label for the region (e.g., "Distal Phalanges", "Liver")</li>
            <li>Click "Finish Region" when done with that polygon</li>
            <li>
              <strong>For multi-part anatomical structures:</strong>
              <ul className="list-disc list-inside ml-6 mt-1 space-y-1">
                <li>After finishing the first region, click "Add Another Region to This Label"</li>
                <li>Draw additional polygons (e.g., for each of the 5 distal phalanges)</li>
                <li>All regions will share the same label and color</li>
                <li>Click "Done Adding Regions" when finished with that anatomical part</li>
              </ul>
            </li>
            <li>Repeat for all body parts you want to annotate</li>
            <li>Click "Download SVG" to get your interactive diagram</li>
            <li>Click "Download Region List (JSON)" to get the mapping data</li>
            <li>Place the SVG in your <code className="bg-gray-100 px-1">public/anatomical-images/</code> folder</li>
            <li>Use the region mapping in your AnatomyDatabase.ts file (supports both single and array of IDs)</li>
          </ol>
        </div>
      </div>
    </main>
  );
}
