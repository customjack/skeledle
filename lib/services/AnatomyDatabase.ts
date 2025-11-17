import { AnatomicalPart, BodySystem, BodyRegion } from '../models/AnatomicalPart';
import anatomicalPartsData from '../../data/anatomical-parts.json';

interface AnatomicalPartData {
  id: string;
  name: string;
  commonName: string;
  system: string;
  region: string;
  svgPaths: string | string[];
  aliases: string[];
  diagramPath?: string;
}

/**
 * Singleton database of anatomical parts
 * Loads data from JSON file
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
   * Initialize with data from JSON file
   */
  private initializeData(): void {
    const parts: AnatomicalPart[] = (anatomicalPartsData as AnatomicalPartData[]).map(data => {
      return new AnatomicalPart(
        data.id,
        data.name,
        data.commonName,
        data.system as BodySystem,
        data.region as BodyRegion,
        data.svgPaths,
        data.aliases,
        data.diagramPath
      );
    });

    // Load all parts from JSON
    parts.forEach(part => {
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
   * Get parts by body system
   */
  getPartsBySystem(system: BodySystem): AnatomicalPart[] {
    return this.getAllParts().filter(part => part.system === system);
  }

  /**
   * Get parts by body region
   */
  getPartsByRegion(region: BodyRegion): AnatomicalPart[] {
    return this.getAllParts().filter(part => part.region === region);
  }

  /**
   * Search parts by name or alias (prefix matching only)
   */
  searchParts(query: string): AnatomicalPart[] {
    if (!query) return this.getAllParts();

    const lowerQuery = query.toLowerCase();
    return this.getAllParts().filter(part =>
      part.name.toLowerCase().startsWith(lowerQuery) ||
      part.aliases.some(alias => alias.toLowerCase().startsWith(lowerQuery))
    );
  }

  /**
   * Get random part
   */
  getRandomPart(): AnatomicalPart {
    const parts = this.getAllParts();
    const randomIndex = Math.floor(Math.random() * parts.length);
    return parts[randomIndex];
  }

  /**
   * Get a part using a seeded random number (for daily challenges)
   */
  getSeededPart(seed: number): AnatomicalPart {
    const parts = this.getAllParts();
    const index = seed % parts.length;
    return parts[index];
  }
}
