import { AnatomicalPart, BodySystem, BodyRegion } from '../models/AnatomicalPart';

/**
 * Singleton database of anatomical parts
 * In a real implementation, this would load from a JSON file or API
 */
export class AnatomyDatabase {
  private static instance: AnatomyDatabase;
  private parts: Map<string, AnatomicalPart>;

  private constructor() {
    this.parts = new Map();
    this.initializeData();
  }

  static getInstance(): AnatomyDatabase {
    if (!AnatomyDatabase.instance) {
      AnatomyDatabase.instance = new AnatomyDatabase();
    }
    return AnatomyDatabase.instance;
  }

  /**
   * Initialize with starter data
   * TODO: Load from external data source
   */
  private initializeData(): void {
    const starterParts: AnatomicalPart[] = [
      // Skeletal System - Head
      new AnatomicalPart('skull', 'Skull', 'Skull', BodySystem.SKELETAL, BodyRegion.HEAD, 'Skull', ['cranium', 'head bones']),
      new AnatomicalPart('cranium', 'Cranium', 'Brain Case', BodySystem.SKELETAL, BodyRegion.HEAD, 'Cranium', ['skull cap']),
      new AnatomicalPart('mandible', 'Mandible', 'Lower Jaw', BodySystem.SKELETAL, BodyRegion.HEAD, 'Mandible', ['jaw', 'lower jaw', 'jawbone']),

      // Skeletal System - Spine
      new AnatomicalPart('cervical-vertebrae', 'Cervical Vertebrae', 'Neck Bones', BodySystem.SKELETAL, BodyRegion.NECK, 'CervicalVertebrae', ['neck vertebrae', 'C-spine']),
      new AnatomicalPart('thoracic-vertebrae', 'Thoracic Vertebrae', 'Upper Back Bones', BodySystem.SKELETAL, BodyRegion.BACK, 'ThoracicVertebrae', ['upper spine', 'T-spine']),
      new AnatomicalPart('lumbar-vertebrae', 'Lumbar Vertebrae', 'Lower Back Bones', BodySystem.SKELETAL, BodyRegion.BACK, 'LumbarVertebrae', ['lower spine', 'L-spine']),
      new AnatomicalPart('sacrum', 'Sacrum', 'Tailbone Base', BodySystem.SKELETAL, BodyRegion.PELVIS, 'Sacrum', ['sacred bone']),
      new AnatomicalPart('coccyx', 'Coccyx', 'Tailbone', BodySystem.SKELETAL, BodyRegion.PELVIS, 'Coccyx', ['tail bone']),

      // Skeletal System - Thorax
      new AnatomicalPart('sternum', 'Sternum', 'Breastbone', BodySystem.SKELETAL, BodyRegion.THORAX, 'Sternum', ['breastbone', 'chest bone']),
      new AnatomicalPart('manubrium', 'Manubrium', 'Upper Sternum', BodySystem.SKELETAL, BodyRegion.THORAX, 'Manubrium', ['upper breastbone']),
      new AnatomicalPart('clavicle', 'Clavicle', 'Collarbone', BodySystem.SKELETAL, BodyRegion.THORAX, ['ClavicleLeft', 'ClavicleRight'], ['collarbone']),
      new AnatomicalPart('scapula', 'Scapula', 'Shoulder Blade', BodySystem.SKELETAL, BodyRegion.THORAX, 'Scapula', ['shoulder blade', 'scapulae']),

      // Skeletal System - Pelvis
      new AnatomicalPart('pelvis', 'Pelvic Girdle', 'Hip Bones', BodySystem.SKELETAL, BodyRegion.PELVIS, 'PelvicGirdle', ['pelvis', 'hip bones', 'pelvic bone']),

      // Skeletal System - Upper Limb
      new AnatomicalPart('humerus', 'Humerus', 'Upper Arm Bone', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['HumerusLeft', 'HumerusRight'], ['upper arm bone']),
      new AnatomicalPart('radius', 'Radius', 'Forearm Bone (Thumb Side)', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['RadiusLeft', 'RadiusRight'], ['radius']),
      new AnatomicalPart('ulna', 'Ulna', 'Forearm Bone (Pinky Side)', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['UlnaLeft', 'UlnaRight'], ['ulna']),
      new AnatomicalPart('carpals', 'Carpals', 'Wrist Bones', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['CarpalsLeft', 'CarpalsRight'], ['wrist', 'wrist bones']),
      new AnatomicalPart('metacarpals', 'Metacarpals', 'Hand Bones', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['MetacarpalsLeft', 'MetacarpalsRight'], ['hand bones']),
      new AnatomicalPart('phalanges-hand', 'Phalanges (Hand)', 'Finger Bones', BodySystem.SKELETAL, BodyRegion.UPPER_LIMB, ['PhalangesLeft', 'PhalangesRight'], ['fingers', 'finger bones']),

      // Skeletal System - Lower Limb
      new AnatomicalPart('femur', 'Femur', 'Thigh Bone', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, 'FemurLeft', ['thigh bone', 'femur']), // Only left femur in SVG
      new AnatomicalPart('patella', 'Patella', 'Kneecap', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['PatellaLeft', 'PatellaRight'], ['kneecap', 'knee cap']),
      new AnatomicalPart('tibia', 'Tibia', 'Shin Bone', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['TibiaLeft', 'TibiaRight'], ['shin bone', 'shin']),
      new AnatomicalPart('fibula', 'Fibula', 'Calf Bone', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['FibulaLeft', 'FibulaRight'], ['calf bone', 'fibula']),
      new AnatomicalPart('tarsals', 'Tarsals', 'Ankle Bones', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['TarsalsLeft', 'TarsalsRight'], ['ankle', 'ankle bones', 'heel']),
      new AnatomicalPart('metatarsals', 'Metatarsals', 'Foot Bones', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['MetatarsalsLeft', 'MetatarsalsRight'], ['foot bones']),
      new AnatomicalPart('phalanges-foot', 'Phalanges (Foot)', 'Toe Bones', BodySystem.SKELETAL, BodyRegion.LOWER_LIMB, ['PhalangesFootLeft', 'PhalangesFootRight'], ['toes', 'toe bones']),

      // Hand Bones - grouped selections from hand_diagram.svg
      new AnatomicalPart(
        'hand-distal-phalanges',
        'Distal Phalanges',
        'Fingertips',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'distal-phalanges',
        ['fingertips', 'distal phalanges'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-middle-phalanges',
        'Middle Phalanges',
        'Finger Middles',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'middle-phalanges',
        ['middle phalanges', 'middle finger bones'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-proximal-phalanges',
        'Proximal Phalanges',
        'Finger Bases',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'proximal-phalanges',
        ['proximal phalanges', 'finger bases'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-metacarpals',
        'Metacarpals',
        'Hand Bones',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'metacarpals',
        ['metacarpals', 'hand bones'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-trapezium',
        'Trapezium',
        'Greater Multangular',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'trapezium',
        ['greater multangular', 'trapezium bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-trapezoid',
        'Trapezoid',
        'Lesser Multangular',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'trapezoid',
        ['lesser multangular', 'trapezoid bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-capitate',
        'Capitate',
        'Capitate Bone',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'capitate',
        ['capitate bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-hamate',
        'Hamate',
        'Hamate Bone',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'hamate',
        ['hamate bone', 'unciform'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-scaphoid',
        'Scaphoid',
        'Navicular of Hand',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'scaphoid',
        ['navicular bone', 'scaphoid bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-lunate',
        'Lunate',
        'Lunate Bone',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'lunate',
        ['lunate bone', 'semilunar bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-triquetrum',
        'Triquetrum',
        'Triquetral Bone',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'triquetrum',
        ['triquetral bone', 'cuneiform bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
      new AnatomicalPart(
        'hand-pisiform',
        'Pisiform',
        'Pisiform Bone',
        BodySystem.SKELETAL,
        BodyRegion.UPPER_LIMB,
        'pisiform',
        ['pisiform bone'],
        '/anatomical-images/hand_diagram.svg'
      ),
    ];

    starterParts.forEach(part => {
      this.parts.set(part.id, part);
    });
  }

  /**
   * Get all anatomical parts
   */
  getAllParts(): AnatomicalPart[] {
    return Array.from(this.parts.values());
  }

  /**
   * Get a part by ID
   */
  getPart(id: string): AnatomicalPart | undefined {
    return this.parts.get(id);
  }

  /**
   * Search parts by name (for autocomplete)
   */
  searchParts(query: string): AnatomicalPart[] {
    if (!query) return this.getAllParts();

    const lowerQuery = query.toLowerCase();
    return this.getAllParts().filter(part =>
      part.name.toLowerCase().includes(lowerQuery) ||
      part.commonName.toLowerCase().includes(lowerQuery) ||
      part.aliases.some(alias => alias.toLowerCase().includes(lowerQuery))
    );
  }

  /**
   * Get a random part (for endless mode)
   */
  getRandomPart(): AnatomicalPart {
    const allParts = this.getAllParts();
    const randomIndex = Math.floor(Math.random() * allParts.length);
    return allParts[randomIndex];
  }

  /**
   * Get a seeded random part (for daily mode)
   */
  getSeededPart(seed: number): AnatomicalPart {
    const allParts = this.getAllParts();
    // Simple seeded random
    const index = seed % allParts.length;
    return allParts[index];
  }
}
