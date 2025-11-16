# Anatomy Assets & Data Integration Guide

This guide explains how to source and integrate professional anatomical diagrams and data into Skeledle.

## Current Status

The prototype uses placeholder SVG drawings. To make this a production-quality game, you need:
1. **Professional anatomical diagrams** (SVG or high-res images)
2. **Comprehensive anatomical database** with accurate terminology and locations
3. **Highlighting system** to indicate specific body parts

## Best Free Resources Found

### 1. Wikimedia Commons (RECOMMENDED - Easiest Start)

**Best for:** Skeletal system, labeled diagrams

**Key Files to Download:**
- **Skeleton Front**: https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg
- **Skeleton Back**: https://commons.wikimedia.org/wiki/File:Human_skeleton_back_en.svg
- **Skull (simplified)**: https://commons.wikimedia.org/wiki/File:Human_skull_side_simplified_(bones).svg
- **Leg bones labeled**: https://commons.wikimedia.org/wiki/File:Human_leg_bones_labeled.svg
- **Axial skeleton**: https://commons.wikimedia.org/wiki/File:Axial_skeleton_diagram.svg
- **Appendicular skeleton**: https://commons.wikimedia.org/wiki/File:Appendicular_skeleton_diagram.svg

**Browse more:** https://commons.wikimedia.org/wiki/Category:SVG_human_skeleton

**How to download:**
1. Visit the file page on Wikimedia Commons
2. Click "More details" then right-click "Original file" and save
3. Place SVG files in `public/anatomical-images/`

**Advantages:**
- Free, open license (CC BY-SA or public domain)
- SVG format (scalable, can be styled with CSS)
- Already labeled with anatomical terms
- Individual bones may be separate SVG elements (can be highlighted)

**How to check if SVG has separate elements:**
```bash
# View the SVG file structure
cat public/anatomical-images/skeleton-front.svg | grep "<g id"
```

### 2. BodyParts3D Database (For Comprehensive Data)

**Best for:** 1,523 anatomical parts with 3D models and standardized terminology

**Download:**
```bash
# Download the entire database (127 MB)
curl -O ftp://ftp.biosciencedbc.jp/archive/bodyparts3d/LATEST/isa_BP3D_4.0_obj_99.zip
unzip isa_BP3D_4.0_obj_99.zip
```

**Contains:**
- 1,523 body parts
- OBJ 3D model files
- FMA (Foundational Model of Anatomy) IDs
- Standardized anatomical terminology
- CSV data files with part names and relationships

**License:** Creative Commons Attribution-ShareAlike

**How to use:**
1. Extract the CSV files for anatomical terminology
2. Parse the data to build your `AnatomyDatabase`
3. Optionally: Use 3D models with Three.js for interactive visualization

### 3. FreeSVG.org

**URL:** https://freesvg.org (search "anatomy" or "human body")

**Best for:** Simple, clean diagrams

**License:** CC0 (public domain)

**Examples:**
- Organ diagrams
- System overviews
- Simplified body outlines

### 4. GetBodySmart (Reference Only)

**URL:** https://www.getbodysmart.com/skeletal-system/

**Note:** This is a commercial educational site. Do NOT scrape images.

**Use it for:**
- Reference for what good interactive anatomy looks like
- Understanding anatomical relationships
- Verifying your database accuracy

## Implementation Strategies

### Strategy 1: SVG with Element IDs (RECOMMENDED)

Download Wikimedia Commons SVGs that have individual bones/organs as separate `<g>` or `<path>` elements.

**Example SVG structure you're looking for:**
```xml
<svg>
  <g id="femur">
    <path d="..." />
  </g>
  <g id="tibia">
    <path d="..." />
  </g>
</svg>
```

**Implementation:**
1. Download SVG files to `public/anatomical-images/`
2. Update `BodyDiagram.tsx` to load external SVG
3. Use CSS or inline styling to highlight specific elements by ID
4. Map anatomical part IDs in your database to SVG element IDs

### Strategy 2: Image with Coordinate-Based Highlighting

If SVGs don't have separate elements, use image maps or canvas overlays.

**Implementation:**
1. Use high-res PNG/JPG diagrams
2. Define bounding box coordinates for each body part
3. Render overlay highlights using canvas or SVG layer
4. Store coordinates in `AnatomicalPart` model

### Strategy 3: Multiple Layered Images

Use separate images for each body system, overlaid on top of each other.

**Implementation:**
1. Download system-specific diagrams (skeletal, muscular, organs)
2. Use CSS layers to show/hide systems
3. Highlight specific parts using opacity or color filters

## Step-by-Step Integration Plan

### Phase 1: Download Assets (Manual)

```bash
cd public/anatomical-images

# Download from Wikimedia Commons (visit URLs in browser, save as):
# 1. Human_skeleton_front_en.svg
# 2. Human_skeleton_back_en.svg
# 3. Gray's_Anatomy_plate_112.svg (organs)
# 4. Digestive_system_diagram_en.svg
# 5. Circulatory_System_en.svg
```

### Phase 2: Inspect SVG Structure

```bash
# Check if bones are separate elements
grep -o 'id="[^"]*"' skeleton-front.svg | head -20

# Look for patterns like id="femur", id="tibia", etc.
```

### Phase 3: Update Code

**Update `AnatomicalPart` model** to include SVG file reference:

```typescript
export class AnatomicalPart {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly commonName: string,
    public readonly system: BodySystem,
    public readonly region: BodyRegion,
    public readonly svgFile: string,        // e.g., "skeleton-front.svg"
    public readonly svgElementId: string,    // e.g., "femur"
    public readonly aliases: string[] = [],
  ) {}
}
```

**Update `BodyDiagram` component**:

```typescript
// Load SVG and highlight specific element
<object
  data={`/anatomical-images/${highlightedPart.svgFile}`}
  type="image/svg+xml"
  className="anatomy-diagram"
>
  <style>{`
    #${highlightedPart.svgElementId} {
      fill: #ff6b6b !important;
      opacity: 0.6;
    }
  `}</style>
</object>
```

### Phase 4: Build Database from BodyParts3D

Create a script to parse BodyParts3D CSV data:

```typescript
// scripts/import-bodyparts3d.ts
// Parse FMA IDs, names, and relationships
// Generate comprehensive anatomical-data.json
```

## Recommended Starting Point

**For a working prototype within 1 hour:**

1. **Download 2-3 SVG files from Wikimedia Commons:**
   - Skeleton front view
   - Skeleton back view
   - Basic organs diagram

2. **Manually inspect and extract 20-30 parts:**
   - Open SVG in text editor
   - Find element IDs that match bone names
   - Update `AnatomyDatabase.ts` with real SVG file/ID mappings

3. **Update `BodyDiagram.tsx`:**
   - Replace placeholder SVG with `<object>` tag loading external SVG
   - Use CSS injection to highlight specific element IDs

4. **Test and iterate:**
   - Start with skeletal system only
   - Verify highlighting works
   - Gradually add more systems

## Alternative: Quick Win with Image Maps

If SVG manipulation is too complex initially:

1. Use high-quality JPG/PNG diagrams
2. Create clickable image maps with `<area>` tags
3. Use canvas overlay to draw highlight shapes
4. Define simple polygons for each body part

**Example:**
```html
<div style="position: relative">
  <img src="skeleton.jpg" usemap="#bodymap" />
  <canvas id="highlight-layer"></canvas>
</div>
<map name="bodymap">
  <area shape="poly" coords="100,200,120,250,..." data-part="femur" />
</map>
```

## Legal Compliance

- ✅ Wikimedia Commons (CC BY-SA) - Free to use, must attribute
- ✅ BodyParts3D (CC BY-SA) - Free to use, must attribute
- ✅ FreeSVG (CC0) - Public domain, no attribution required
- ❌ GetBodySmart - Copyrighted, do not scrape
- ❌ ZygoBody/Google Body - Discontinued, unclear licensing

## Attribution Required

Add to your app footer:

```
Anatomical diagrams derived from:
- Wikimedia Commons (CC BY-SA 3.0)
- BodyParts3D © Database Center for Life Science (CC BY-SA 2.1 JP)
```

## Next Steps

1. **Download 3-5 SVG files from Wikimedia Commons manually**
2. **Inspect their structure** to see if bones are separate elements
3. **Update the code** to load external SVGs with highlighting
4. **Report back** which SVGs worked best for highlighting
5. **Then:** Automate data import from BodyParts3D for comprehensive coverage

Let me know which approach you want to take and I can help implement it!
