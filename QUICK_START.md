# Quick Start: Getting Real Anatomical Diagrams

## What You Need to Do Right Now

The app is working but using placeholder diagrams. To get professional anatomical images:

### Option 1: Manual Download (5 minutes - EASIEST)

1. **Create the images directory:**
   ```bash
   mkdir -p public/anatomical-images
   ```

2. **Visit these Wikimedia Commons pages and download the SVG files:**

   **For Skeletal System:**
   - [Human skeleton front](https://commons.wikimedia.org/wiki/File:Human_skeleton_front_en.svg)
     - Click "More details" → Right-click "Original file" → Save as `skeleton-front.svg`

   - [Human skeleton back](https://commons.wikimedia.org/wiki/File:Human_skeleton_back_en.svg)
     - Save as `skeleton-back.svg`

3. **Move downloaded files to:**
   ```
   public/anatomical-images/skeleton-front.svg
   public/anatomical-images/skeleton-back.svg
   ```

4. **Refresh the app** - it will automatically try to load the SVG files!

### Option 2: Use a Sample SVG (1 minute - FOR TESTING)

I can create a simple sample SVG with labeled bones for you to test the highlighting system.

### Option 3: Direct Download via Terminal (if Wikimedia allows)

```bash
cd public/anatomical-images

# Try downloading (may be blocked by Wikimedia)
curl -L -o skeleton-front.svg "https://upload.wikimedia.org/wikipedia/commons/5/59/Human_skeleton_front_en.svg"
```

## After You Get SVG Files

### Step 1: Inspect the SVG

Open the SVG file in a text editor and look for element IDs:

```bash
grep -o 'id="[^"]*"' public/anatomical-images/skeleton-front.svg | head -20
```

You're looking for IDs like:
- `id="femur"`
- `id="tibia"`
- `id="humerus"`
- etc.

### Step 2: Update the Database

Edit `lib/services/AnatomyDatabase.ts` and update the `svgPath` property to match the actual SVG element IDs you found.

**Example:**
```typescript
new AnatomicalPart(
  'femur',
  'Femur',
  'Thigh Bone',
  BodySystem.SKELETAL,
  BodyRegion.LOWER_LIMB,
  'femur',  // ← This must match the id="..." in the SVG file
  ['thigh bone']
)
```

### Step 3: Test It!

1. Start the game
2. If an element is found in the SVG, it will be highlighted in red
3. If not found, you'll see a warning in the browser console

## Troubleshooting

### SVG file doesn't load
- Check browser console for errors
- Verify file is in `public/anatomical-images/`
- Try opening SVG directly: `http://localhost:3000/anatomical-images/skeleton-front.svg`

### Highlighting doesn't work
- Open browser developer tools console
- Look for warning: "SVG element with id 'xyz' not found"
- Inspect the SVG file to find the correct element IDs
- Update `AnatomyDatabase.ts` with correct IDs

### SVG is too big/small
- The component automatically scales the SVG to fit
- You can adjust sizing in `BodyDiagramSVG.tsx` if needed

## What the Code Does Now

1. **BodyDiagramSVG component** loads external SVG files
2. When a body part is selected, it finds the element by ID
3. It applies red highlighting using inline CSS
4. If SVG fails to load, it shows a placeholder diagram

## Next Steps After Getting Basic SVGs Working

1. Download more systems (muscular, organs, nervous)
2. Expand the anatomical database with more parts
3. Map SVG element IDs to anatomical part names
4. Add front/back view switching
5. Consider using BodyParts3D database for comprehensive coverage

See `ANATOMY_ASSETS_GUIDE.md` for the full guide!
