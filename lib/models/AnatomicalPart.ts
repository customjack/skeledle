/**
 * Represents a body system (skeletal, muscular, nervous, etc.)
 */
export enum BodySystem {
  SKELETAL = 'skeletal',
  MUSCULAR = 'muscular',
  NERVOUS = 'nervous',
  CARDIOVASCULAR = 'cardiovascular',
  RESPIRATORY = 'respiratory',
  DIGESTIVE = 'digestive',
  ENDOCRINE = 'endocrine',
  LYMPHATIC = 'lymphatic',
  URINARY = 'urinary',
  REPRODUCTIVE = 'reproductive',
}

/**
 * Represents a region of the body
 */
export enum BodyRegion {
  HEAD = 'head',
  NECK = 'neck',
  THORAX = 'thorax',
  ABDOMEN = 'abdomen',
  PELVIS = 'pelvis',
  UPPER_LIMB = 'upper_limb',
  LOWER_LIMB = 'lower_limb',
  BACK = 'back',
}

/**
 * Represents an anatomical part with all its metadata
 */
export class AnatomicalPart {
  constructor(
    public readonly id: string,
    public readonly name: string,
    public readonly commonName: string,
    public readonly system: BodySystem,
    public readonly region: BodyRegion,
    public readonly svgPath: string | string[], // SVG path ID(s) for highlighting - can be single or array for bilateral parts
    public readonly aliases: string[] = [],
    public readonly svgFile: string = '/anatomical-images/Human_skeleton_front_-_no_labels.svg', // Which SVG diagram contains this part
  ) {}

  /**
   * Get all SVG paths as an array (normalizes both single and array inputs)
   */
  getSvgPaths(): string[] {
    return Array.isArray(this.svgPath) ? this.svgPath : [this.svgPath];
  }

  /**
   * Check if a guess matches this anatomical part
   */
  matches(guess: string): boolean {
    const normalized = guess.toLowerCase().trim();
    return (
      this.name.toLowerCase() === normalized ||
      this.commonName.toLowerCase() === normalized ||
      this.aliases.some(alias => alias.toLowerCase() === normalized)
    );
  }

  /**
   * Get a hint about how close a guess is
   */
  getProximityHint(guess: AnatomicalPart): ProximityHint {
    return {
      correctSystem: this.system === guess.system,
      correctRegion: this.region === guess.region,
      sameName: this.matches(guess.name),
    };
  }
}

/**
 * Feedback about how close a guess is
 */
export interface ProximityHint {
  correctSystem: boolean;
  correctRegion: boolean;
  sameName: boolean;
}
