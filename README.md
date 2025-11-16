# Skeledle

A medical anatomy guessing game inspired by Wordle. Test your knowledge of human anatomy by identifying highlighted body parts!

## Current Status

✅ **Working prototype with:**
- Professional skeleton diagram from Wikimedia Commons (no labels)
- Game logic (6 guesses, win/lose conditions)
- Searchable dropdown for anatomical terms
- Daily and Endless modes
- **NEW: Explorer Mode** - hover over bones to learn anatomy interactively
- 45 skeletal parts mapped and ready to play

⚠️ **Future enhancements:**
- Add muscular, organ, and nervous systems
- Multiple viewing angles (front, back, side)
- More detailed bone subdivisions

## Game Modes

### Daily Challenge & Endless Mode
1. Choose between **Daily Challenge** (one puzzle per day) or **Endless Mode** (unlimited puzzles)
2. A body part will be highlighted on the diagram
3. Search and guess the medical name from the dropdown
4. You get 6 guesses, with hints after each attempt:
   - ✓ **System**: Is your guess in the correct body system? (skeletal, muscular, etc.)
   - ✓ **Region**: Is your guess in the correct body region? (head, thorax, etc.)
5. Win by guessing correctly, or see the answer after 6 wrong guesses

### Explorer Mode (Study Tool)
- Hover over bones to see them highlighted in blue
- Click to pin a bone and see detailed information
- Browse the complete list of all 45 bones
- Perfect for studying before playing!
- See [EXPLORER_MODE.md](EXPLORER_MODE.md) for details

## Development

### Running the Dev Server

```bash
npm install
npm run dev
```

Visit [http://localhost:3000](http://localhost:3000) to play the game.

### Building for Production

```bash
npm run build
```

This creates a static export in the `out/` directory, ready for GitHub Pages deployment.

## Architecture

The project uses an object-oriented, scalable architecture:

### Core Models
- **AnatomicalPart** ([lib/models/AnatomicalPart.ts](lib/models/AnatomicalPart.ts)): Represents a body part with medical/common names, system, region, and SVG path
- **GameState** ([lib/models/GameState.ts](lib/models/GameState.ts)): Manages game state including guesses, feedback, and win/lose conditions

### Services
- **AnatomyDatabase** ([lib/services/AnatomyDatabase.ts](lib/services/AnatomyDatabase.ts)): Singleton database of anatomical parts with search functionality
- **GameEngine** ([lib/services/GameEngine.ts](lib/services/GameEngine.ts)): Creates games, manages daily seeding, and provides search interface

### Components
- **SearchableDropdown** ([components/SearchableDropdown.tsx](components/SearchableDropdown.tsx)): Keyboard-navigable search with autocomplete
- **BodyDiagram** ([components/BodyDiagram.tsx](components/BodyDiagram.tsx)): SVG-based body visualization with highlighting
- **GuessHistory** ([components/GuessHistory.tsx](components/GuessHistory.tsx)): Displays previous guesses with feedback

## Next Steps

### Data Sources Needed
1. **Medical Glossary**: Find a comprehensive anatomical database linking terms to body locations
   - Consider: OpenAnatomy, BodyParts3D, or medical education APIs
   - Format: JSON with fields for medical name, common name, system, region, coordinates

2. **Body Diagrams**: Replace simple SVG with detailed segmented anatomy
   - Options:
     - SVG anatomical atlases (free medical education resources)
     - Segment existing diagrams using image editing tools
     - Use 3D model projections with labeled regions

### Features to Add
- Difficulty levels (beginner: common names, expert: medical terms only)
- Statistics tracking (win rate, streak, etc.)
- Share results (like Wordle's emoji grid)
- More body systems and parts
- Multiple views (front, back, side)
- Zoom functionality for detailed areas
- Hint system (reveal system, region, or letter)

## Deployment to GitHub Pages

1. Update `basePath` in [next.config.js](next.config.js) if your repo name differs from 'skeledle'
2. Build: `npm run build`
3. The `out/` directory contains the static site
4. Deploy to GitHub Pages using the `out/` directory

## Tech Stack

- Next.js 16 (App Router)
- TypeScript
- Tailwind CSS
- Static export for GitHub Pages

## License

MIT
