import { GameState, GameMode } from '../models/GameState';
import { AnatomicalPart } from '../models/AnatomicalPart';
import { AnatomyDatabase } from './AnatomyDatabase';

/**
 * Game engine that manages game creation and logic
 */
export class GameEngine {
  private database: AnatomyDatabase;

  constructor() {
    this.database = AnatomyDatabase.getInstance();
  }

  /**
   * Create a new daily game based on today's date
   */
  createDailyGame(): GameState {
    const seed = this.getDailySeed();
    const targetPart = this.database.getSeededPart(seed);
    return new GameState(targetPart, GameMode.DAILY);
  }

  /**
   * Create a new endless mode game
   */
  createEndlessGame(): GameState {
    const targetPart = this.database.getRandomPart();
    return new GameState(targetPart, GameMode.ENDLESS);
  }

  /**
   * Get today's seed (number of days since epoch)
   */
  private getDailySeed(): number {
    const now = new Date();
    const start = new Date(2024, 0, 1); // Jan 1, 2024
    const diff = now.getTime() - start.getTime();
    return Math.floor(diff / (1000 * 60 * 60 * 24));
  }

  /**
   * Get all available parts for searching
   */
  searchParts(query: string): AnatomicalPart[] {
    return this.database.searchParts(query);
  }

  /**
   * Get a part by ID
   */
  getPart(id: string): AnatomicalPart | undefined {
    return this.database.getPart(id);
  }
}
