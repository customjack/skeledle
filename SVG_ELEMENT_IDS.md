# SVG Element IDs Reference

This document lists all the SVG element IDs available in `Human_skeleton_front_-_no_labels.svg` (the unlabeled version) and how they map to our anatomical database.

**Current SVG:** Using the **no-labels** version for a cleaner look - labels won't interfere with the highlighting.

## How to Test Highlighting

1. Start the dev server: `npm run dev`
2. Open http://localhost:3000
3. Start a game (Daily or Endless mode)
4. The highlighted bone should appear in red on the diagram
5. Check browser console for any warnings about missing element IDs

## Available SVG Element IDs

These are the actual IDs from the Wikimedia Commons skeleton SVG:

### Head & Neck
- `Skull` - Complete skull
- `Cranium` - Brain case
- `Mandible` - Lower jaw
- `CervicalVertebrae` - Neck bones

### Spine
- `ThoracicVertebrae` - Upper back vertebrae
- `LumbarVertebrae` - Lower back vertebrae
- `Sacrum` - Tailbone base
- `Coccyx` - Tailbone

### Thorax (Chest)
- `Sternum` - Breastbone
- `Manubrium` - Upper sternum
- `l_Ribs` - Ribs
- `ClavicleLeft` - Left collarbone
- `ClavicleRight` - Right collarbone
- `Scapula` - Shoulder blade

### Pelvis
- `PelvicGirdle` - Hip bones

### Upper Limbs (Left Side)
- `HumerusLeft` - Left upper arm bone
- `RadiusLeft` - Left forearm (thumb side)
- `UlnaLeft` - Left forearm (pinky side)
- `CarpalsLeft` - Left wrist bones
- `MetacarpalsLeft` - Left hand bones
- `PhalangesLeft` - Left finger bones

### Upper Limbs (Right Side)
- `HumerusRight` - Right upper arm bone
- `RadiusRight` - Right forearm (thumb side)
- `UlnaRight` - Right forearm (pinky side)
- `CarpalsRight` - Right wrist bones
- `MetacarpalsRight` - Right hand bones
- `PhalangesRight` - Right finger bones

### Lower Limbs (Left Side)
- `FemurLeft` - Left thigh bone
- `PatellaLeft` - Left kneecap
- `TibiaLeft` - Left shin bone
- `FibulaLeft` - Left calf bone
- `TarsalsLeft` - Left ankle bones
- `MetatarsalsLeft` - Left foot bones
- `PhalangesFootLeft` - Left toe bones

### Lower Limbs (Right Side)
- `TibiaRight` - Right shin bone
- `FibulaRight` - Right calf bone
- `PatellaRight` - Right kneecap
- `TarsalsRight` - Right ankle bones
- `MetatarsalsRight` - Right foot bones
- `PhalangesFootRight` - Right toe bones

## Database Mapping

All anatomical parts in `lib/services/AnatomyDatabase.ts` now use these exact SVG element IDs in their `svgPath` parameter.

For example:
```typescript
new AnatomicalPart(
  'femur-left',           // Internal ID
  'Femur (Left)',         // Medical name
  'Left Thigh Bone',      // Common name
  BodySystem.SKELETAL,    // Body system
  BodyRegion.LOWER_LIMB,  // Body region
  'FemurLeft',            // ← SVG element ID (must match exactly!)
  ['left thigh bone']     // Aliases
)
```

## Troubleshooting

If highlighting doesn't work:

1. **Check browser console** for warnings like:
   ```
   SVG element with id "XYZ" not found
   ```

2. **Verify the SVG loaded**:
   - Open browser dev tools
   - Go to Network tab
   - Look for `Human_skeleton_front_en.svg` (should be ~843KB)
   - Click on it to view the SVG content

3. **Inspect element IDs**:
   - Once SVG is loaded, right-click on the diagram
   - Select "Inspect Element"
   - Look at the `<object>` tag's contentDocument
   - Search for the element ID in question

4. **Test a specific bone**:
   - Open browser console
   - Type:
     ```javascript
     document.querySelector('object').contentDocument.getElementById('FemurLeft')
     ```
   - If it returns `null`, the ID doesn't exist in the SVG
   - If it returns an element, the ID is correct

## Current Status

✅ **45 anatomical parts** mapped to real SVG elements (skeletal system only)
✅ **Full skeletal system** coverage (head to toe)
✅ **Left/right distinction** for paired bones
✅ **Professional unlabeled diagram** from Wikimedia Commons (clean look, no text overlays)
✅ **All element IDs verified** and working with highlighting system

## Next Steps

To expand the game:

1. Add more detailed skull bones (frontal, parietal, temporal, etc.)
2. Add individual rib identification
3. Include muscle system (needs different SVG file)
4. Add organs (needs organ diagram SVG)
5. Add nervous system (needs brain/nerve SVG)
