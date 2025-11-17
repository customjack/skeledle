import { AnatomicalPart, ProximityHint } from './AnatomicalPart';

export enum GameMode {
  DAILY = 'daily',
  ENDLESS = 'endless',
}

export enum GameStatus {
  PLAYING = 'playing',
  WON = 'won',
  LOST = 'lost',
}

/**
 * Represents a single guess in the game
 */
export interface Guess {
  part: AnatomicalPart;
  hint: ProximityHint;
  timestamp: Date;
}

/**
 * Manages the state of a single game session
 */
export class GameState {
  private static readonly MAX_GUESSES = 6;

  constructor(
    public readonly targetPart: AnatomicalPart,
    public readonly mode: GameMode,
    public readonly guesses: Guess[] = [],
    public readonly status: GameStatus = GameStatus.PLAYING,
  ) {}

  /**
   * Make a guess and return the new game state
   */
  makeGuess(guessedPart: AnatomicalPart): GameState {
    if (this.status !== GameStatus.PLAYING) {
      return this; // Game is over
    }

    const hint = this.targetPart.getProximityHint(guessedPart);
    const newGuess: Guess = {
      part: guessedPart,
      hint,
      timestamp: new Date(),
    };

    const newGuesses = [...this.guesses, newGuess];
    let newStatus: GameStatus = this.status;

    // Check if won
    if (hint.sameName) {
      newStatus = GameStatus.WON;
    }
    // Check if lost (max guesses reached)
    else if (newGuesses.length >= GameState.MAX_GUESSES) {
      newStatus = GameStatus.LOST;
    }

    return new GameState(this.targetPart, this.mode, newGuesses, newStatus);
  }

  /**
   * Get remaining guesses
   */
  getRemainingGuesses(): number {
    return Math.max(0, GameState.MAX_GUESSES - this.guesses.length);
  }

  /**
   * Check if a part has already been guessed
   */
  hasBeenGuessed(part: AnatomicalPart): boolean {
    return this.guesses.some(g => g.part.id === part.id);
  }

  /**
   * Serialize to JSON for storage
   */
  toJSON() {
    return {
      targetPartId: this.targetPart.id,
      mode: this.mode,
      guesses: this.guesses.map(g => ({
        partId: g.part.id,
        hint: g.hint,
        timestamp: g.timestamp.toISOString(),
      })),
      status: this.status,
    };
  }
}
